use serde::Serialize;
use swc_common;
use swc_common::Span;
use swc_common::Spanned;
use swc_ecma_ast;

use super::parser::DocParser;
use super::ts_type::ts_type_ann_to_def;
use super::ts_type::TsTypeDef;
use super::DocNode;
use super::DocNodeKind;
use super::ParamDef;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionDef {
  pub params: Vec<ParamDef>,
  pub return_type: Option<TsTypeDef>,
  pub is_async: bool,
  pub is_generator: bool,
  // TODO: type_params, decorators
}

pub fn function_to_function_def(
  doc_parser: &DocParser,
  function: &swc_ecma_ast::Function,
) -> FunctionDef {
  let mut params = vec![];

  for param in &function.params {
    use swc_ecma_ast::Pat;

    let param_def = match param {
      Pat::Ident(ident) => {
        let ts_type = ident
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        ParamDef {
          name: ident.sym.to_string(),
          ts_type,
        }
      }
      _ => ParamDef {
        name: "<TODO>".to_string(),
        ts_type: None,
      },
    };

    params.push(param_def);
  }

  let maybe_return_type = function
    .return_type
    .as_ref()
    .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

  FunctionDef {
    params,
    return_type: maybe_return_type,
    is_async: function.is_async,
    is_generator: function.is_generator,
  }
}

pub fn get_doc_for_fn_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  fn_decl: &swc_ecma_ast::FnDecl,
) -> DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);

  let mut snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found");

  if let Some(body) = &fn_decl.function.body {
    let body_span = body.span();
    let body_snippet =
      doc_parser.source_map.span_to_snippet(body_span).unwrap();
    let index = snippet
      .find(&body_snippet)
      .expect("Body not found in snippet");
    // Remove body from snippet
    let _ = snippet.split_off(index);
  }

  let snippet = snippet.trim_end().to_string();
  let fn_def = function_to_function_def(doc_parser, &fn_decl.function);

  DocNode {
    kind: DocNodeKind::Function,
    name: fn_decl.ident.sym.to_string(),
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(parent_span.lo())
      .into(),
    js_doc,
    function_def: Some(fn_def),
    variable_def: None,
    enum_def: None,
    class_def: None,
    type_alias_def: None,
    namespace_def: None,
    interface_def: None,
  }
}
