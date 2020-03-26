use swc_common;
use swc_common::Spanned;
use swc_ecma_ast;

use super::parser::DocParser;
use super::DocNode;

pub fn get_doc_node_for_export_decl(
  doc_parser: &DocParser,
  export_decl: &swc_ecma_ast::ExportDecl,
) -> DocNode {
  let export_span = export_decl.span();
  use swc_ecma_ast::Decl;
  match &export_decl.decl {
    Decl::Class(class_decl) => {
      super::class::get_doc_for_class_decl(doc_parser, export_span, class_decl)
    }
    Decl::Fn(fn_decl) => {
      super::function::get_doc_for_fn_decl(doc_parser, export_span, fn_decl)
    }
    Decl::Var(var_decl) => {
      super::variable::get_doc_for_var_decl(doc_parser, export_span, var_decl)
    }
    Decl::TsInterface(ts_interface_decl) => {
      super::interface::get_doc_for_ts_interface_decl(
        doc_parser,
        export_span,
        ts_interface_decl,
      )
    }
    Decl::TsTypeAlias(ts_type_alias) => {
      super::type_alias::get_doc_for_ts_type_alias_decl(
        doc_parser,
        export_span,
        ts_type_alias,
      )
    }
    Decl::TsEnum(ts_enum) => {
      super::r#enum::get_doc_for_ts_enum_decl(doc_parser, export_span, ts_enum)
    }
    Decl::TsModule(ts_module) => super::namespace::get_doc_for_ts_module(
      doc_parser,
      export_span,
      ts_module,
    ),
  }
}

pub fn get_doc_nodes_for_named_export(
  doc_parser: &DocParser,
  named_export: &swc_ecma_ast::NamedExport,
) -> Vec<DocNode> {
  let file_name = named_export.src.as_ref().expect("").value.to_string();
  // TODO: resolve specifier
  let source_code =
    std::fs::read_to_string(&file_name).expect("Failed to read file");
  let doc_nodes = doc_parser
    .parse(file_name, source_code)
    .expect("Failed to print docs");
  let reexports: Vec<String> = named_export
    .specifiers
    .iter()
    .map(|export_specifier| {
      use swc_ecma_ast::ExportSpecifier::*;

      match export_specifier {
        Named(named_export_specifier) => {
          Some(named_export_specifier.orig.sym.to_string())
        }
        // TODO:
        Namespace(_) => None,
        Default(_) => None,
      }
    })
    .filter(|s| s.is_some())
    .map(|s| s.unwrap())
    .collect();

  let reexports_docs: Vec<DocNode> = doc_nodes
    .into_iter()
    .filter(|doc_node| reexports.contains(&doc_node.name))
    .collect();

  reexports_docs
}
