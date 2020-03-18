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
    pub fn new() -> Self {
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

    pub fn print_docs(
        &mut self,
        file_name: String,
        source_code: String,
    ) -> Result<(), SwcDiagnostics> {
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

            for node in module.body.iter() {
                match node {
                    swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) => match module_decl {
                        swc_ecma_ast::ModuleDecl::ExportDecl(export_decl) => {
                            let span = export_decl.span;
                            if let Some(cmts) = self.comments.take_leading_comments(span.lo()) {
                                for com in cmts {
                                    println!("comment: {:#?}", com.text);
                                    let text = com.text.to_string();
                                    let js_doc = text.trim_start_matches("*").trim_start();
                                    println!("{:#?}", js_doc);
                                }
                                let line_no = swc_source_file.lookup_line(span.lo()).unwrap();
                                let line = swc_source_file.get_line(line_no).unwrap().to_string();
                                println!("code line: {:#?}", line);
                                let declaration = line.trim_end().trim_end_matches("{");
                                println!("{:#?}", declaration);
                            }
                            match &export_decl.decl {
                                swc_ecma_ast::Decl::Fn(fn_decl) => {
                                    println!("go fn decl");
                                    let span = fn_decl.ident.span;
                                    if let Some(cmts) =
                                        self.comments.take_leading_comments(span.lo())
                                    {
                                        println!("go fn decl comments {:#?}", cmts);
                                    }
                                }
                                _ => println!("not a decl"),
                            }
                        }
                        _ => {
                            println!("not an export decl");
                        }
                    },
                    _ => {
                        println!("not a module decl");
                    }
                }
            }

            Ok(())
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
    let mut compiler = Compiler::new();
    compiler
        .print_docs(file_name, source_code)
        .expect("Failed to print docs");
}
