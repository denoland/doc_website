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

    let doc_entries = doc::module::get_doc_nodes_for_module_body(&doc_parser, module.body);
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

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn export_fn() {
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
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::Function);
    assert_eq!(
      entry.js_doc,
      Some(
        r#"Hello there, this is a multiline JSdoc.

It has many lines

Or not that many?"#
          .to_string()
      )
    );
    assert_eq!(
      entry.snippet,
      "export function foo(a: string, b: number): void"
    );
  }

  #[test]
  fn export_const() {
    let source_code =
            "/** Something about fizzBuzz */\nexport const fizzBuzz = \"fizzBuzz\";\n";
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::Variable);
    assert_eq!(entry.js_doc, Some("Something about fizzBuzz".to_string()));
    assert_eq!(entry.snippet, "export const fizzBuzz = \"fizzBuzz\";");
  }

  #[test]
  fn export_class() {
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
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::Class);
    assert_eq!(entry.js_doc, Some("Class doc".to_string()));
    assert_eq!(
      entry.snippet,
      r#"export class Foobar extends Fizz implements Buzz"#
    );
  }

  #[test]
  fn export_interface() {
    let source_code = r#"
/**
 * Interface js doc
 */
export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
}
    "#;
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::Interface);
    assert_eq!(entry.js_doc, Some("Interface js doc".to_string()));
    assert_eq!(
      entry.snippet,
      r#"export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
}"#
    );
  }

  #[test]
  fn export_type_alias() {
    let source_code = r#"
/** Array holding numbers */
export type NumberArray = Array<number>;
    "#;
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::TypeAlias);
    assert_eq!(entry.js_doc, Some("Array holding numbers".to_string()));
    assert_eq!(entry.snippet, "export type NumberArray = Array<number>;");
  }

  #[test]
  fn export_enum() {
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
    let entries =
      get_docs("test.ts".to_string(), source_code.to_string()).unwrap();
    assert_eq!(entries.len(), 1);
    let entry = &entries[0];
    assert_eq!(entry.kind, doc::DocNodeKind::Enum);
    assert_eq!(entry.js_doc, Some("Some enum for good measure".to_string()));
    assert_eq!(
      entry.snippet,
      r#"export enum Hello {
    World = "world",
    Fizz = "fizz",
    Buzz = "buzz",
}"#
    );
  }
}
