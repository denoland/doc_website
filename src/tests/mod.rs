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
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
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
}

#[test]
fn export_const() {
  let source_code =
    "/** Something about fizzBuzz */\nexport const fizzBuzz = \"fizzBuzz\";\n";
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
  assert_eq!(entries.len(), 1);
  let entry = &entries[0];
  assert_eq!(entry.kind, doc::DocNodeKind::Variable);
  assert_eq!(entry.js_doc, Some("Something about fizzBuzz".to_string()));
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
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
  assert_eq!(entries.len(), 1);
  let entry = &entries[0];
  assert_eq!(entry.kind, doc::DocNodeKind::Class);
  assert_eq!(entry.js_doc, Some("Class doc".to_string()));
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
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
  assert_eq!(entries.len(), 1);
  let entry = &entries[0];
  assert_eq!(entry.kind, doc::DocNodeKind::Interface);
  assert_eq!(entry.js_doc, Some("Interface js doc".to_string()));
}

#[test]
fn export_type_alias() {
  let source_code = r#"
/** Array holding numbers */
export type NumberArray = Array<number>;
    "#;
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
  assert_eq!(entries.len(), 1);
  let entry = &entries[0];
  assert_eq!(entry.kind, doc::DocNodeKind::TypeAlias);
  assert_eq!(entry.js_doc, Some("Array holding numbers".to_string()));
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
  let entries = doc::DocParser::default()
    .parse("test.ts".to_string(), source_code.to_string())
    .unwrap();
  assert_eq!(entries.len(), 1);
  let entry = &entries[0];
  assert_eq!(entry.kind, doc::DocNodeKind::Enum);
  assert_eq!(entry.js_doc, Some("Some enum for good measure".to_string()));
}
