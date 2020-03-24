use serde::Serialize;
use swc_common;
use swc_common::Span;
use swc_ecma_ast;

use super::parser::DocParser;
use super::ts_type::ts_type_ann_to_def;
use super::ts_type::TsTypeDef;
use super::DocNode;
use super::DocNodeKind;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct VariableDef {
  pub ts_type: Option<TsTypeDef>,
  pub kind: swc_ecma_ast::VarDeclKind,
}

pub fn get_doc_for_var_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  var_decl: &swc_ecma_ast::VarDecl,
) -> DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);
  let snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found")
    .trim_end()
    .to_string();

  // eprintln!("var def {:#?}", var_decl);
  assert!(!var_decl.decls.is_empty());
  // TODO: support multiple declarators
  let var_declarator = var_decl.decls.get(0).unwrap();

  let var_name = match &var_declarator.name {
    swc_ecma_ast::Pat::Ident(ident) => ident.sym.to_string(),
    _ => "<TODO>".to_string(),
  };

  let maybe_ts_type = match &var_declarator.name {
    swc_ecma_ast::Pat::Ident(ident) => ident
      .type_ann
      .as_ref()
      .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt)),
    _ => None,
  };

  let variable_def = VariableDef {
    ts_type: maybe_ts_type,
    kind: var_decl.kind,
  };

  DocNode {
    kind: DocNodeKind::Variable,
    name: var_name,
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(parent_span.lo())
      .into(),
    js_doc,
    function_def: None,
    variable_def: Some(variable_def),
    enum_def: None,
    class_def: None,
    type_alias_def: None,
    namespace_def: None,
    interface_def: None,
  }
}
