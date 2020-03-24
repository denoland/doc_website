use swc_common;
use swc_common::errors::DiagnosticBuilder;
use swc_common::FileName;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::JscTarget;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Session;
use swc_ecma_parser::SourceFileInput;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;

use crate::doc::parser::DocParser;
use crate::doc::parser::SwcDiagnostics;
mod doc;

#[cfg(test)]
mod tests;

pub fn get_docs(
  file_name: String,
  source_code: String,
) -> Result<Vec<doc::DocNode>, SwcDiagnostics> {
  let doc_parser = DocParser::default();

  swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
    let swc_source_file = doc_parser
      .source_map
      .new_source_file(FileName::Custom(file_name), source_code);

    let buffered_err = doc_parser.buffered_error.clone();
    let session = Session {
      handler: &doc_parser.handler,
    };

    let mut ts_config = TsConfig::default();
    ts_config.dynamic_import = true;
    let syntax = Syntax::Typescript(ts_config);

    let lexer = Lexer::new(
      session,
      syntax,
      JscTarget::Es2019,
      SourceFileInput::from(&*swc_source_file),
      Some(&doc_parser.comments),
    );

    let mut parser = Parser::new_from(session, lexer);

    let module =
      parser
        .parse_module()
        .map_err(move |mut err: DiagnosticBuilder| {
          err.cancel();
          SwcDiagnostics::from(buffered_err)
        })?;

    let doc_entries =
      doc::module::get_doc_nodes_for_module_body(&doc_parser, module.body);
    Ok(doc_entries)
  })
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
  let doc_nodes =
    get_docs(file_name, source_code).expect("Failed to print docs");

  let docs_json = serde_json::to_string_pretty(&doc_nodes).unwrap();

  println!("{}", docs_json);
}
