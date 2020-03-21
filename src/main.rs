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

mod doc;

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
      comment.kind == CommentKind::Block && comment.text.starts_with('*')
    })?;

    // SWC strips leading and trailing markers, add them back, so we're working
    // on "raw" JSDoc later.
    Some(format!("/*{}*/", js_doc_comment.text))
  }

  fn get_doc_for_fn_decl(
    &self,
    parent_span: Span,
    fn_decl: &swc_ecma_ast::FnDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);

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

    let snippet = snippet.trim_end().to_string();

    let maybe_return_type = fn_decl.function.return_type.as_ref().map(|rt| {
      let repr = self
        .source_map
        .span_to_snippet(rt.span)
        .expect("Return type not found");
      let repr = repr.trim_start_matches(":").trim_start().to_string();

      doc::TsTypeDef { repr }
    });

    let fn_def = doc::FunctionDef {
      args: vec![],
      return_type: maybe_return_type,
      is_async: fn_decl.function.is_async,
      is_generator: fn_decl.function.is_generator,
    };

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::Function,
      name: fn_decl.ident.sym.to_string(),
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: Some(fn_def),
      variable_def: None,
      enum_def: None,
      class_def: None,
      type_alias_def: None,
      namespace_def: None,
      interface_def: None,
    };

    eprintln!("doc node {:#?}", doc_node);
    doc_node
  }

  fn get_doc_for_var_decl(
    &self,
    parent_span: Span,
    _var_decl: &swc_ecma_ast::VarDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);
    let snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found")
      .trim_end()
      .to_string();

    let var_name = "<TODO>".to_string();

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::Variable,
      name: var_name,
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: None,
      variable_def: None,
      enum_def: None,
      class_def: None,
      type_alias_def: None,
      namespace_def: None,
      interface_def: None,
    };

    eprintln!("doc node {:#?}", doc_node);
    doc_node
  }

  fn get_doc_for_ts_type_alias_decl(
    &self,
    parent_span: Span,
    type_alias_decl: &swc_ecma_ast::TsTypeAliasDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);
    let snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found")
      .trim_end()
      .to_string();

    let alias_name = type_alias_decl.id.sym.to_string();
    // TODO:
    let type_alias_def = doc::TypeAliasDef {};

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::TypeAlias,
      name: alias_name,
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: None,
      variable_def: None,
      enum_def: None,
      class_def: None,
      type_alias_def: Some(type_alias_def),
      namespace_def: None,
      interface_def: None,
    };

    eprintln!("doc node {:#?}", doc_node);

    doc_node
  }

  fn get_doc_for_class_decl(
    &self,
    parent_span: Span,
    class_decl: &swc_ecma_ast::ClassDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);

    let mut snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found");

    if !class_decl.class.body.is_empty() {
      let body_beggining_span = class_decl.class.body.first().unwrap().span();
      let body_end_span = class_decl.class.body.last().unwrap().span();
      let body_span = Span::new(
        body_beggining_span.lo(),
        body_end_span.hi(),
        body_end_span.ctxt(),
      );
      let body_snippet = self.source_map.span_to_snippet(body_span).unwrap();
      let index = snippet
        .find(&body_snippet)
        .expect("Body not found in snippet");
      // Remove body from snippet
      let _ = snippet.split_off(index);
    }

    // TODO(bartlomieju): trimming manually `{` is bad
    let mut snippet = snippet
      .trim_end()
      .trim_end_matches('{')
      .trim_end()
      .to_string();

    let class_name = class_decl.ident.sym.to_string();
    let class_def = doc::ClassDef {
      constructors: vec![],
      properties: vec![],
      methods: vec![],
    };

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::Class,
      name: class_name,
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: None,
      variable_def: None,
      enum_def: None,
      class_def: Some(class_def),
      type_alias_def: None,
      namespace_def: None,
      interface_def: None,
    };

    eprintln!("doc node {:#?}", doc_node);

    snippet.push_str(" {\n");

    for member in &class_decl.class.body {
      use swc_ecma_ast::ClassMember::*;

      match member {
        Constructor(ctor) => {
          let ctor_js_doc = self.get_js_doc(ctor.span());
          let mut ctor_snippet =
            self.source_map.span_to_snippet(ctor.span()).unwrap();

          if let Some(body) = &ctor.body {
            let ctor_body_snippet =
              self.source_map.span_to_snippet(body.span()).unwrap();
            let index = ctor_snippet
              .find(&ctor_body_snippet)
              .expect("Body not found in snippet");
            // Remove body from snippet
            let _ = ctor_snippet.split_off(index);
          }

          let mut ctor_snippet = ctor_snippet.trim_end().to_string();

          if !ctor_snippet.ends_with(';') {
            ctor_snippet.push_str(";");
          }

          //   eprintln!("ctor jsdoc {:?}", ctor_js_doc);
          //   eprintln!("ctor snippet {:?}", ctor_snippet);
          if let Some(doc) = ctor_js_doc {
            snippet.push_str(&format!("  {}\n", doc));
          }
          snippet.push_str(&format!("  {}\n", ctor_snippet));
        }
        Method(class_method) => {
          let method_js_doc = self.get_js_doc(class_method.span());
          let mut method_snippet = self
            .source_map
            .span_to_snippet(class_method.span())
            .unwrap();

          if let Some(body) = &class_method.function.body {
            let body_span = body.span();
            let body_snippet =
              self.source_map.span_to_snippet(body_span).unwrap();
            let index = method_snippet
              .find(&body_snippet)
              .expect("Body not found in snippet");
            // Remove body from snippet
            let _ = method_snippet.split_off(index);
          }

          let mut method_snippet = method_snippet.trim_end().to_string();

          if !method_snippet.ends_with(';') {
            method_snippet.push_str(";");
          }

          //   eprintln!("method jsdoc {:?}", method_js_doc);
          //   eprintln!("method snippet {:?}", method_snippet);

          if let Some(doc) = method_js_doc {
            snippet.push_str(&format!("  {}\n", doc));
          }
          snippet.push_str(&format!("  {}\n", method_snippet));
        }
        ClassProp(class_prop) => {
          let prop_js_doc = self.get_js_doc(class_prop.span());
          let prop_snippet =
            self.source_map.span_to_snippet(class_prop.span()).unwrap();

          if let Some(swc_ecma_ast::Accessibility::Private) =
            class_prop.accessibility
          {
            continue;
          }

          //   eprintln!("method jsdoc {:?}", prop_js_doc);
          //   eprintln!("method snippet {:?}", prop_snippet);

          if let Some(doc) = prop_js_doc {
            snippet.push_str(&format!("  {}\n", doc));
          }
          snippet.push_str(&format!("  {}\n", prop_snippet));
        }
        TsIndexSignature(ts_index_signature) => {
          let index_js_doc = self.get_js_doc(ts_index_signature.span());
          let index_snippet = self
            .source_map
            .span_to_snippet(ts_index_signature.span())
            .unwrap();

          if let Some(doc) = index_js_doc {
            snippet.push_str(&format!("  {}\n", doc));
          }
          snippet.push_str(&format!("  {}\n", index_snippet));
        }
        // Ignored in output
        PrivateMethod(_) => {}
        PrivateProp(_) => {}
      }
    }

    snippet.push_str("}");

    doc_node
  }

  fn get_doc_for_ts_interface_decl(
    &self,
    parent_span: Span,
    interface_decl: &swc_ecma_ast::TsInterfaceDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);
    let snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found");

    let interface_name = interface_decl.id.sym.to_string();

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::Interface,
      name: interface_name,
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: None,
      variable_def: None,
      enum_def: None,
      class_def: None,
      type_alias_def: None,
      namespace_def: None,
      interface_def: Some(doc::InterfaceDef {}),
    };

    eprintln!("doc node {:#?}", doc_node);
    doc_node
  }

  fn get_doc_for_ts_enum_decl(
    &self,
    parent_span: Span,
    enum_decl: &swc_ecma_ast::TsEnumDecl,
  ) -> doc::DocNode {
    let js_doc = self.get_js_doc(parent_span);
    let snippet = self
      .source_map
      .span_to_snippet(parent_span)
      .expect("Snippet not found")
      .trim_end()
      .to_string();

    let enum_name = enum_decl.id.sym.to_string();
    let mut members = vec![];

    for enum_member in &enum_decl.members {
      use swc_ecma_ast::TsEnumMemberId::*;

      let member_name = match &enum_member.id {
        Ident(ident) => ident.sym.to_string(),
        Str(str_) => str_.value.to_string(),
      };

      let member_def = doc::EnumMemberDef { name: member_name };
      members.push(member_def);
    }

    let enum_def = doc::EnumDef { members };

    let doc_node = doc::DocNode {
      kind: doc::DocNodeKind::Enum,
      name: enum_name,
      snippet: snippet.to_string(),
      location: self.source_map.lookup_char_pos(parent_span.lo()),
      js_doc: js_doc.clone(),
      function_def: None,
      variable_def: None,
      enum_def: Some(enum_def),
      class_def: None,
      type_alias_def: None,
      namespace_def: None,
      interface_def: None,
    };

    eprintln!("doc node {:#?}", doc_node);
    doc_node
  }

  pub fn get_docs(
    &mut self,
    file_name: String,
    source_code: String,
  ) -> Result<Vec<doc::DocNode>, SwcDiagnostics> {
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

      let mut doc_entries: Vec<doc::DocNode> = vec![];

      for node in module.body.iter() {
        if let swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) = node {
          use swc_ecma_ast::ModuleDecl::*;

          let maybe_doc_node = match module_decl {
            ExportDecl(export_decl) => {
              eprintln!("export decl {:?}", export_decl);
              let export_span = export_decl.span();

              //   eprintln!(
              //     "span to string {:?}",
              //     self.source_map.span_to_snippet(export_span)
              //   );
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
                    export_span,
                    ts_interface_decl,
                  ))
                }
                TsTypeAlias(ts_type_alias) => Some(
                  self
                    .get_doc_for_ts_type_alias_decl(export_span, ts_type_alias),
                ),
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

          if let Some(doc_entry) = maybe_doc_node {
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
  let doc_nodes = compiler
    .get_docs(file_name, source_code)
    .expect("Failed to print docs");

  for doc_node in doc_nodes {
    if let Some(doc) = doc_node.js_doc {
      println!("{}", doc);
    }
    println!("{}", doc_node.snippet);
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
      Some(
        r#"/**
* Hello there, this is a multiline JSdoc.
* 
* It has many lines
* 
* Or not that many?
*/"#
          .to_string()
      )
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
    assert_eq!(
      entry.js_doc,
      Some("/** Something about fizzBuzz */".to_string())
    );
    assert_eq!(
      entry.declaration_str,
      "export const fizzBuzz = \"fizzBuzz\";"
    );
  }

  #[test]
  fn export_class() {
    let mut compiler = DocParser::default();
    let source_code = r#"
/** Class doc */
export class Foobar extends Fizz implements Buzz {
    private private1: boolean;
    protected protected1: number;
    public public1: boolean;
    public2: number;

    /** Constructor js doc */
    constructor(name: string, private private2: number, protected protected2: number) {}

    /** Async foo method */
    async foo(): Promise<void> {
        //
    }

    /** Sync bar method */
    bar(): void {
        //
    }
}
"#;
    let result =
      compiler.get_docs("test.ts".to_string(), source_code.to_string());
    assert!(result.is_ok());
    let entries = result.unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.js_doc, Some("/** Class doc */".to_string()));
    assert_eq!(
      entry.declaration_str,
      r#"export class Foobar extends Fizz implements Buzz {
  protected protected1: number;
  public public1: boolean;
  public2: number;
  /** Constructor js doc */
  constructor(name: string, private private2: number, protected protected2: number);
  /** Async foo method */
  async foo(): Promise<void>;
  /** Sync bar method */
  bar(): void;
}"#
    );
  }

  #[test]
  fn export_interface() {
    let mut compiler = DocParser::default();
    let source_code = r#"
/**
 * Interface js doc
 */
export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
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
      Some("/**\n * Interface js doc\n */".to_string())
    );
    assert_eq!(
      entry.declaration_str,
      r#"export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
}"#
    );
  }

  #[test]
  fn export_type_alias() {
    let mut compiler = DocParser::default();
    let source_code = r#"
/** Array holding numbers */
export type NumberArray = Array<number>;
    "#;
    let result =
      compiler.get_docs("test.ts".to_string(), source_code.to_string());
    assert!(result.is_ok());
    let entries = result.unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(
      entry.js_doc,
      Some("/** Array holding numbers */".to_string())
    );
    assert_eq!(
      entry.declaration_str,
      "export type NumberArray = Array<number>;"
    );
  }

  #[test]
  fn export_enum() {
    let mut compiler = DocParser::default();
    let source_code = r#"
/**
 * Some enum for good measure
 */
export enum Hello {
    World = "world",
    Fizz = "fizz",
    Buzz = "buzz",
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
      Some("/**\n * Some enum for good measure\n */".to_string())
    );
    assert_eq!(
      entry.declaration_str,
      r#"export enum Hello {
    World = "world",
    Fizz = "fizz",
    Buzz = "buzz",
};"#
    );
  }
}
