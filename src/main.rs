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

pub struct DocEntry {
    js_doc: String,
    declaration: String,
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
            return comment.kind == CommentKind::Block && comment.text.starts_with('*');
        })?;

        // SWC strips leading and trailing markers, add them back, so we're working
        // on "raw" JSDoc later.
        Some(format!("/*{}*/", js_doc_comment.text))
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

            let module = parser
                .parse_module()
                .map_err(move |mut err: DiagnosticBuilder| {
                    err.cancel();
                    SwcDiagnostics::from(buffered_err)
                })?;

            let mut doc_entries: Vec<DocEntry> = vec![];

            for node in module.body.iter() {
                if let swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) = node {
                    use swc_ecma_ast::ModuleDecl::*;

                    match module_decl {
                        ExportDecl(export_decl) => {
                            let span = export_decl.span;

                            // If there's no JS doc for exported member go to next declaration
                            if let Some(js_doc) = self.get_js_doc(span) {
                                let line_no = swc_source_file.lookup_line(span.lo()).unwrap();
                                let line = swc_source_file.get_line(line_no).unwrap().to_string();
                                // TODO(bartlomieju): construct declaration string in a more
                                // robust way instead of trimming
                                let declaration = line.trim_end().trim_end_matches('{').to_string();
                                doc_entries.push(DocEntry {
                                    js_doc,
                                    declaration,
                                })
                            }
                        }
                        ExportNamed(_) => todo!(),
                        ExportDefaultDecl(_) => todo!(),
                        ExportDefaultExpr(_) => todo!(),
                        ExportAll(_) => todo!(),
                        TsExportAssignment(_) => todo!(),
                        TsNamespaceExport(_) => todo!(),
                        _ => todo!(),
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
    let source_code = std::fs::read_to_string(&file_name).expect("Failed to read file");
    let mut compiler = DocParser::default();
    let doc_entries = compiler
        .get_docs(file_name, source_code)
        .expect("Failed to print docs");

    for doc_entry in doc_entries {
        println!("{}", doc_entry.js_doc);
        println!("{}", doc_entry.declaration);
        println!();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn export_const() {
        let mut compiler = DocParser::default();
        let source_code =
            "/** Something about fizzBuzz */\nexport const fizzBuzz = \"fizzBuzz\";\n";
        let result = compiler.get_docs("test.ts".to_string(), source_code.to_string());
        assert!(result.is_ok());
        let entries = result.unwrap();
        assert_eq!(entries.len(), 1);
        let entry = &entries[0];
        assert_eq!(entry.js_doc, "/** Something about fizzBuzz */");
        assert_eq!(entry.declaration, "export const fizzBuzz = \"fizzBuzz\";");
    }
}
