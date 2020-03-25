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
  let ts_type = type_alias_decl.type_ann.as_ref().into();

  let type_alias_def = TypeAliasDef { ts_type };

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
    type_alias_def: Some(type_alias_def),
    namespace_def: None,
    interface_def: None,
  }
}
