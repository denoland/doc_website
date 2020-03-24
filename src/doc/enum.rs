use serde::Serialize;
use swc_common;
use swc_common::Span;
use swc_ecma_ast;

use super::parser::DocParser;
use super::DocNode;
use super::DocNodeKind;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumMemberDef {
  pub name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EnumDef {
  pub members: Vec<EnumMemberDef>,
}

pub fn get_doc_for_ts_enum_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  enum_decl: &swc_ecma_ast::TsEnumDecl,
) -> DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);
  let snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found")
    .trim_end()
    .to_string();

  let enum_name = enum_decl.id.sym.to_string();
  let mut members = vec![];

  for enum_member in &enum_decl.members {
    use swc_ecma_ast::TsEnumMemberId::*;

    let member_name = match &enum_member.id {
      Ident(ident) => ident.sym.to_string(),
      Str(str_) => str_.value.to_string(),
    };

    let member_def = EnumMemberDef { name: member_name };
    members.push(member_def);
  }

  let enum_def = EnumDef { members };

  DocNode {
    kind: DocNodeKind::Enum,
    name: enum_name,
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(parent_span.lo())
      .into(),
    js_doc,
    function_def: None,
    variable_def: None,
    enum_def: Some(enum_def),
    class_def: None,
    type_alias_def: None,
    namespace_def: None,
    interface_def: None,
  }
}
