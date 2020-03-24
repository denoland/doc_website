use serde::Serialize;
use swc_common;
use swc_common::Span;
use swc_ecma_ast;

use super::parser::DocParser;
use super::ts_type::TsTypeDef;
use super::DocNode;
use super::DocNodeKind;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeAliasDef {
  pub ts_type: TsTypeDef,
  // TODO: type_params
}

pub fn get_doc_for_ts_type_alias_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  type_alias_decl: &swc_ecma_ast::TsTypeAliasDecl,
) -> DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);
  let snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found")
    .trim_end()
    .to_string();

  let alias_name = type_alias_decl.id.sym.to_string();
  // TODO:
  //   let repr = doc_parser
  //     .source_map
  //     .span_to_snippet(type_alias_decl.span)
  //     .expect("Class prop type not found");
  //   let repr = repr.trim_start_matches(':').trim_start().to_string();

  DocNode {
    kind: DocNodeKind::TypeAlias,
    name: alias_name,
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(parent_span.lo())
      .into(),
    js_doc,
    function_def: None,
    variable_def: None,
    enum_def: None,
    class_def: None,
    type_alias_def: None,
    namespace_def: None,
    interface_def: None,
  }
}
