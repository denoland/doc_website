use std::sync::Arc;
use std::sync::RwLock;
use swc_common;
use swc_common::comments::Comments;
use swc_common::errors::Diagnostic;
use swc_common::errors::DiagnosticBuilder;
use swc_common::errors::Emitter;
use swc_common::errors::Handler;
use swc_common::errors::HandlerFlags;
use swc_common::FileName;
use swc_common::SourceMap;
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

pub struct Compiler {
    buffered_error: BufferedError,
    pub source_map: Arc<SourceMap>,
    pub handler: Handler,
    comments: Comments,
}

impl Compiler {
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

        Compiler {
            buffered_error,
            source_map: Arc::new(SourceMap::default()),
            handler,
            comments: Comments::default(),
        }
    }

    pub fn get_docs(
        &mut self,
        file_name: String,
        source_code: String,
    ) -> Result<String, SwcDiagnostics> {
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

            let mut docstring = String::new();

            for node in module.body.iter() {
                if let swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) = node {
                    if let swc_ecma_ast::ModuleDecl::ExportDecl(export_decl) = module_decl {
                        let span = export_decl.span;
                        if let Some(comments) = self.comments.take_leading_comments(span.lo()) {
                            for comment in comments {
                                let text = comment.text.to_string();
                                docstring.push_str(&format!("/*{}*/\n", text));
                            }
                        }

                        let line_no = swc_source_file.lookup_line(span.lo()).unwrap();
                        let line = swc_source_file.get_line(line_no).unwrap().to_string();
                        // TODO(bartlomieju): construct declaration string in a more
                        // robust way instead of trimming
                        let declaration = line.trim_end().trim_end_matches('{');
                        docstring.push_str(&format!("{}\n", declaration));
                    }
                }
            }

            Ok(docstring)
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
    let mut compiler = Compiler::default();
    let docstring = compiler
        .get_docs(file_name, source_code)
        .expect("Failed to print docs");
    println!("{}", docstring);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn export_const() {
        let mut compiler = Compiler::default();
        let source_code =
            "/** Something about fizzBuzz */\nexport const fizzBuzz = \"fizzBuzz\";\n";
        let result = compiler.get_docs("test.ts".to_string(), source_code.to_string());
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), source_code);
    }
}
