use std::sync::Arc;
use std::sync::RwLock;
use swc_common;
use swc_common::comments::CommentKind;
use swc_common::comments::Comments;
use swc_common::errors::Diagnostic;
use swc_common::errors::DiagnosticBuilder;
use swc_common::errors::Emitter;
use swc_common::errors::Handler;
use swc_common::errors::HandlerFlags;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_common::Span;
use swc_common::Spanned;
use swc_ecma_ast;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::JscTarget;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Session;
use swc_ecma_parser::SourceFileInput;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;

pub type SwcDiagnostics = Vec<Diagnostic>;

#[derive(Clone, Default)]
pub(crate) struct BufferedError(Arc<RwLock<SwcDiagnostics>>);

impl Emitter for BufferedError {
  fn emit(&mut self, db: &DiagnosticBuilder) {
    self.0.write().unwrap().push((**db).clone());
  }
}

impl From<BufferedError> for Vec<Diagnostic> {
  fn from(buf: BufferedError) -> Self {
    let s = buf.0.read().unwrap();
    s.clone()
  }
}

// export interface DocEntry {
//  kind: "class" | "method" | "property" | "enum" | "enumMember";
//  name: string;
//  typestr?: string;
//  docstr?: string;
//  args?: ArgEntry[];
//  retType?: string;
//  sourceUrl?: string;
// }

// export interface ArgEntry {
//  name: string;
//  typestr?: string;
//  docstr?: string;
// }

pub struct DocEntry {
  js_doc: String,
  declaration_str: String,
  // TODO: add serde and store json for each
}

// struct DocNode {
//     name: String,
//     docstring: Option<String>,
//     declaration: Decl,
//     children: Vec<DocNode>,
// }

pub struct DocParser {
  buffered_error: BufferedError,
  pub source_map: Arc<SourceMap>,
  pub handler: Handler,
  comments: Comments,
}

impl DocParser {
  pub fn default() -> Self {
    let buffered_error = BufferedError::default();

    let handler = Handler::with_emitter_and_flags(
      Box::new(buffered_error.clone()),
      HandlerFlags {
        dont_buffer_diagnostics: true,
        can_emit_warnings: true,
        ..Default::default()
      },
    );

    DocParser {
      buffered_error,
      source_map: Arc::new(SourceMap::default()),
      handler,
      comments: Comments::default(),
    }
  }

  fn get_js_doc(&self, span: Span) -> Option<String> {
    let comments = self.comments.take_leading_comments(span.lo())?;
    let js_doc_comment = comments.iter().find(|comment| {
      return comment.kind == CommentKind::Block
        && comment.text.starts_with('*');
    })?;

    // SWC strips leading and trailing markers, add them back, so we're working
    // on "raw" JSDoc later.
    Some(format!("/*{}*/", js_doc_comment.text))
  }

  fn get_doc_for_fn_decl(
    &self,
    parent_span: Span,
    fn_decl: &swc_ecma_ast::FnDecl,
  ) -> DocEntry {
    let js_doc = self.get_js_doc(parent_span).unwrap_or("".to_string());

    let mut snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found");

    if let Some(body) = &fn_decl.function.body {
      let body_span = body.span();
      let body_snippet = self.source_map.span_to_snippet(body_span).unwrap();
      let index = snippet
        .find(&body_snippet)
        .expect("Body not found in snippet");
      // Remove body from snippet
      let _ = snippet.split_off(index);
    }

    let mut snippet = snippet.trim_end().to_string();

    if !snippet.ends_with(';') {
      snippet.push_str(";");
    }

    DocEntry {
      js_doc,
      declaration_str: snippet.to_string(),
    }
  }

  fn get_doc_for_var_decl(
    &self,
    parent_span: Span,
    _var_decl: &swc_ecma_ast::VarDecl,
  ) -> DocEntry {
    let js_doc = self.get_js_doc(parent_span).unwrap_or("".to_string());
    let snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found");

    let mut snippet = snippet.trim_end().to_string();

    if !snippet.ends_with(';') {
      snippet.push_str(";");
    }

    DocEntry {
      js_doc,
      declaration_str: snippet.to_string(),
    }
  }

  fn get_doc_for_class_decl(
    &self,
    span: Span,
    class_decl: &swc_ecma_ast::ClassDecl,
  ) -> DocEntry {
    let js_doc = self.get_js_doc(span).unwrap_or("".to_string());

    let mut declaration_str = String::new();

    if class_decl.class.is_abstract {
      declaration_str.push_str("abstract ");
    }

    declaration_str.push_str("class ");
    declaration_str.push_str(&class_decl.ident.sym.to_string());

    if let Some(_super_class) = &class_decl.class.super_class {
      declaration_str.push_str(" extends <TODO>");
    }

    if !class_decl.class.implements.is_empty() {
      declaration_str.push_str(" implements");
      for _i in &class_decl.class.implements {
        declaration_str.push_str(" <TODO>,");
      }
    }

    declaration_str.push_str("{\n");

    declaration_str.push_str("}");

    DocEntry {
      js_doc,
      declaration_str,
    }
  }

  fn get_doc_for_ts_interface_decl(
    &self,
    swc_source_file: Arc<swc_common::SourceFile>,
    span: Span,
    _var_decl: &swc_ecma_ast::TsInterfaceDecl,
  ) -> DocEntry {
    let js_doc = self.get_js_doc(span).unwrap_or("".to_string());
    let line_no = swc_source_file.lookup_line(span.lo()).unwrap();
    let line = swc_source_file.get_line(line_no).unwrap().to_string();
    // TODO(bartlomieju): construct declaration string in a more
    // robust way instead of trimming
    let declaration = line.trim_end().to_string();

    DocEntry {
      js_doc,
      declaration_str: declaration.to_string(),
    }
  }

  fn get_doc_for_ts_enum_decl(
    &self,
    span: Span,
    enum_decl: &swc_ecma_ast::TsEnumDecl,
  ) -> DocEntry {
    let js_doc = self.get_js_doc(span).unwrap_or("".to_string());

    let mut declaration_str = String::new();

    if enum_decl.is_const {
      declaration_str.push_str("const ");
    }
    declaration_str.push_str("enum ");
    declaration_str.push_str(&enum_decl.id.sym.to_string());
    declaration_str.push_str(" {\n");

    use swc_ecma_ast::TsEnumMemberId::*;

    for member in &enum_decl.members {
      declaration_str.push_str("\t");
      match &member.id {
        Ident(ident) => {
          declaration_str.push_str(&ident.sym.to_string());
        }
        Str(str_) => {
          declaration_str.push_str(&str_.value.to_string());
        }
      }
      if let Some(_init) = &member.init {
        declaration_str.push_str(" = <TODO>,");
      }
      declaration_str.push_str("\n");
    }

    declaration_str.push_str("}");

    DocEntry {
      js_doc,
      declaration_str,
    }
  }

  pub fn get_docs(
    &mut self,
    file_name: String,
    source_code: String,
  ) -> Result<Vec<DocEntry>, SwcDiagnostics> {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
      let swc_source_file = self
        .source_map
        .new_source_file(FileName::Custom(file_name), source_code);

      let buffered_err = self.buffered_error.clone();
      let session = Session {
        handler: &self.handler,
      };

      let mut ts_config = TsConfig::default();
      ts_config.dynamic_import = true;
      let syntax = Syntax::Typescript(ts_config);

      let lexer = Lexer::new(
        session,
        syntax,
        JscTarget::Es2019,
        SourceFileInput::from(&*swc_source_file),
        Some(&self.comments),
      );

      let mut parser = Parser::new_from(session, lexer);

      let module =
        parser
          .parse_module()
          .map_err(move |mut err: DiagnosticBuilder| {
            err.cancel();
            SwcDiagnostics::from(buffered_err)
          })?;

      let mut doc_entries: Vec<DocEntry> = vec![];

      for node in module.body.iter() {
        if let swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) = node {
          use swc_ecma_ast::ModuleDecl::*;

          let maybe_doc_entry = match module_decl {
            ExportDecl(export_decl) => {
              eprintln!("export decl {:#?}", export_decl);
              let export_span = export_decl.span();

              eprintln!(
                "span to string {:?}",
                self.source_map.span_to_snippet(export_span)
              );
              use swc_ecma_ast::Decl::*;

              match &export_decl.decl {
                Class(class_decl) => {
                  Some(self.get_doc_for_class_decl(export_span, class_decl))
                }
                Fn(fn_decl) => {
                  Some(self.get_doc_for_fn_decl(export_span, fn_decl))
                }
                Var(var_decl) => {
                  Some(self.get_doc_for_var_decl(export_span, var_decl))
                }
                TsInterface(ts_interface_decl) => {
                  Some(self.get_doc_for_ts_interface_decl(
                    swc_source_file.clone(),
                    export_span,
                    ts_interface_decl,
                  ))
                }
                TsTypeAlias(_ts_type_alias) => None,
                TsEnum(ts_enum) => {
                  Some(self.get_doc_for_ts_enum_decl(export_span, ts_enum))
                }
                TsModule(_ts_module) => None,
              }
            }
            ExportNamed(_) => None,
            ExportDefaultDecl(_) => None,
            ExportDefaultExpr(_) => None,
            ExportAll(_) => None,
            TsExportAssignment(_) => None,
            TsNamespaceExport(_) => None,
            _ => None,
          };

          if let Some(doc_entry) = maybe_doc_entry {
            doc_entries.push(doc_entry);
          }
        }
      }

      Ok(doc_entries)
    })
  }
}

fn main() {
  let args: Vec<String> = std::env::args().collect();

  if args.len() < 2 {
    eprintln!("Missing file name");
    std::process::exit(1);
  }

  let file_name = args[1].to_string();
  let source_code =
    std::fs::read_to_string(&file_name).expect("Failed to read file");
  let mut compiler = DocParser::default();
  let doc_entries = compiler
    .get_docs(file_name, source_code)
    .expect("Failed to print docs");

  for doc_entry in doc_entries {
    println!("{}", doc_entry.js_doc);
    println!("{}", doc_entry.declaration_str);
    println!();
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn export_fn() {
    let mut compiler = DocParser::default();
    let source_code = r#"/**
* Hello there, this is a multiline JSdoc.
* 
* It has many lines
* 
* Or not that many?
*/
export function foo(a: string, b: number): void {
    console.log("Hello world");
}
"#;
    let result =
      compiler.get_docs("test.ts".to_string(), source_code.to_string());
    assert!(result.is_ok());
    let entries = result.unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(
      entry.js_doc,
      r#"/**
* Hello there, this is a multiline JSdoc.
* 
* It has many lines
* 
* Or not that many?
*/"#
    );
    assert_eq!(
      entry.declaration_str,
      "export function foo(a: string, b: number): void;"
    );
  }

  #[test]
  fn export_const() {
    let mut compiler = DocParser::default();
    let source_code =
            "/** Something about fizzBuzz */\nexport const fizzBuzz = \"fizzBuzz\";\n";
    let result =
      compiler.get_docs("test.ts".to_string(), source_code.to_string());
    assert!(result.is_ok());
    let entries = result.unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.js_doc, "/** Something about fizzBuzz */");
    assert_eq!(
      entry.declaration_str,
      "export const fizzBuzz = \"fizzBuzz\";"
    );
  }
}
