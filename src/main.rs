use swc_common;
use swc_common::errors::DiagnosticBuilder;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_common::Span;
use swc_common::Spanned;
use swc_ecma_ast;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::JscTarget;
use swc_ecma_parser::Parser;
use swc_ecma_parser::Session;
use swc_ecma_parser::SourceFileInput;
use swc_ecma_parser::Syntax;
use swc_ecma_parser::TsConfig;

use crate::doc::parser::DocParser;
use crate::doc::parser::SwcDiagnostics;
use crate::doc::ts_type::ts_type_ann_to_def;
mod doc;

fn prop_name_to_string(
  source_map: &SourceMap,
  prop_name: &swc_ecma_ast::PropName,
) -> String {
  use swc_ecma_ast::PropName;
  match prop_name {
    PropName::Ident(ident) => ident.sym.to_string(),
    PropName::Str(str_) => str_.value.to_string(),
    PropName::Num(num) => num.value.to_string(),
    PropName::Computed(comp_prop_name) => {
      source_map.span_to_snippet(comp_prop_name.span).unwrap()
    }
  }
}

fn function_to_function_def(
  doc_parser: &DocParser,
  function: &swc_ecma_ast::Function,
) -> doc::FunctionDef {
  let mut params = vec![];

  for param in &function.params {
    use swc_ecma_ast::Pat;

    let param_def = match param {
      Pat::Ident(ident) => {
        let ts_type = ident
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        doc::ParamDef {
          name: ident.sym.to_string(),
          ts_type,
        }
      }
      _ => doc::ParamDef {
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

  doc::FunctionDef {
    params,
    return_type: maybe_return_type,
    is_async: function.is_async,
    is_generator: function.is_generator,
  }
}

fn get_doc_for_fn_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  fn_decl: &swc_ecma_ast::FnDecl,
) -> doc::DocNode {
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

  doc::DocNode {
    kind: doc::DocNodeKind::Function,
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

fn get_doc_for_var_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  var_decl: &swc_ecma_ast::VarDecl,
) -> doc::DocNode {
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

  let variable_def = doc::VariableDef {
    ts_type: maybe_ts_type,
    kind: var_decl.kind,
  };

  doc::DocNode {
    kind: doc::DocNodeKind::Variable,
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

fn get_doc_for_ts_type_alias_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  type_alias_decl: &swc_ecma_ast::TsTypeAliasDecl,
) -> doc::DocNode {
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

  doc::DocNode {
    kind: doc::DocNodeKind::TypeAlias,
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

fn get_doc_for_class_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  class_decl: &swc_ecma_ast::ClassDecl,
) -> doc::DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);

  let mut snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found");

  if !class_decl.class.body.is_empty() {
    let body_beggining_span = class_decl.class.body.first().unwrap().span();
    let body_end_span = class_decl.class.body.last().unwrap().span();
    let body_span = Span::new(
      body_beggining_span.lo(),
      body_end_span.hi(),
      body_end_span.ctxt(),
    );
    let body_snippet =
      doc_parser.source_map.span_to_snippet(body_span).unwrap();
    let index = snippet
      .find(&body_snippet)
      .expect("Body not found in snippet");
    // Remove body from snippet
    let _ = snippet.split_off(index);
  }

  // TODO(bartlomieju): trimming manually `{` is bad
  let snippet = snippet
    .trim_end()
    .trim_end_matches('{')
    .trim_end()
    .to_string();

  let mut constructors = vec![];
  let mut methods = vec![];
  let mut properties = vec![];

  for member in &class_decl.class.body {
    use swc_ecma_ast::ClassMember::*;

    match member {
      Constructor(ctor) => {
        let ctor_js_doc = doc_parser.js_doc_for_span(ctor.span());
        let mut ctor_snippet =
          doc_parser.source_map.span_to_snippet(ctor.span()).unwrap();

        if let Some(body) = &ctor.body {
          let ctor_body_snippet =
            doc_parser.source_map.span_to_snippet(body.span()).unwrap();
          let index = ctor_snippet
            .find(&ctor_body_snippet)
            .expect("Body not found in snippet");
          // Remove body from snippet
          let _ = ctor_snippet.split_off(index);
        }

        let ctor_snippet = ctor_snippet.trim_end().to_string();
        let constructor_name =
          prop_name_to_string(&doc_parser.source_map, &ctor.key);

        let mut params = vec![];

        for param in &ctor.params {
          use swc_ecma_ast::Pat;
          use swc_ecma_ast::PatOrTsParamProp::*;

          let param_def = match param {
            Pat(pat) => match pat {
              Pat::Ident(ident) => {
                let ts_type = ident
                  .type_ann
                  .as_ref()
                  .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

                doc::ParamDef {
                  name: ident.sym.to_string(),
                  ts_type,
                }
              }
              _ => doc::ParamDef {
                name: "<TODO>".to_string(),
                ts_type: None,
              },
            },
            TsParamProp(_) => doc::ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };
          params.push(param_def);
        }

        let constructor_def = doc::ClassConstructorDef {
          js_doc: ctor_js_doc,
          snippet: ctor_snippet,
          accessibility: ctor.accessibility,
          name: constructor_name,
          params,
          location: doc_parser
            .source_map
            .lookup_char_pos(ctor.span.lo())
            .into(),
        };
        constructors.push(constructor_def);
      }
      Method(class_method) => {
        let method_js_doc = doc_parser.js_doc_for_span(class_method.span());
        let mut method_snippet = doc_parser
          .source_map
          .span_to_snippet(class_method.span())
          .unwrap();

        if let Some(body) = &class_method.function.body {
          let body_span = body.span();
          let body_snippet =
            doc_parser.source_map.span_to_snippet(body_span).unwrap();
          let index = method_snippet
            .find(&body_snippet)
            .expect("Body not found in snippet");
          // Remove body from snippet
          let _ = method_snippet.split_off(index);
        }

        let method_snippet = method_snippet.trim_end().to_string();

        let method_name =
          prop_name_to_string(&doc_parser.source_map, &class_method.key);
        let fn_def =
          function_to_function_def(doc_parser, &class_method.function);
        let method_def = doc::ClassMethodDef {
          js_doc: method_js_doc,
          snippet: method_snippet,
          accessibility: class_method.accessibility,
          is_abstract: class_method.is_abstract,
          is_static: class_method.is_static,
          name: method_name,
          kind: class_method.kind,
          function_def: fn_def,
          location: doc_parser
            .source_map
            .lookup_char_pos(class_method.span.lo())
            .into(),
        };
        methods.push(method_def);
      }
      ClassProp(class_prop) => {
        let prop_js_doc = doc_parser.js_doc_for_span(class_prop.span());
        let prop_snippet = doc_parser
          .source_map
          .span_to_snippet(class_prop.span())
          .unwrap();

        let ts_type = class_prop
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        use swc_ecma_ast::Expr;
        let prop_name = match &*class_prop.key {
          Expr::Ident(ident) => ident.sym.to_string(),
          _ => "<TODO>".to_string(),
        };

        let prop_def = doc::ClassPropertyDef {
          js_doc: prop_js_doc,
          snippet: prop_snippet,
          ts_type,
          readonly: class_prop.readonly,
          is_abstract: class_prop.is_abstract,
          is_static: class_prop.is_static,
          accessibility: class_prop.accessibility,
          name: prop_name,
          location: doc_parser
            .source_map
            .lookup_char_pos(class_prop.span.lo())
            .into(),
        };
        properties.push(prop_def);
      }
      // TODO:
      TsIndexSignature(_) => {}
      PrivateMethod(_) => {}
      PrivateProp(_) => {}
    }
  }

  let class_name = class_decl.ident.sym.to_string();
  let class_def = doc::ClassDef {
    is_abstract: class_decl.class.is_abstract,
    constructors,
    properties,
    methods,
  };

  doc::DocNode {
    kind: doc::DocNodeKind::Class,
    name: class_name,
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(parent_span.lo())
      .into(),
    js_doc,
    function_def: None,
    variable_def: None,
    enum_def: None,
    class_def: Some(class_def),
    type_alias_def: None,
    namespace_def: None,
    interface_def: None,
  }
}

fn get_doc_for_ts_interface_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  interface_decl: &swc_ecma_ast::TsInterfaceDecl,
) -> doc::DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);

  let mut snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found");

  if let Some(margin) = doc_parser.source_map.span_to_margin(parent_span) {
    let mut margin_pat = String::from("");
    for _ in 0..margin {
      margin_pat.push(' ');
    }

    snippet = snippet
      .split('\n')
      .map(|line| {
        if line.starts_with(&margin_pat) {
          line[margin_pat.len()..].to_string()
        } else {
          line.to_string()
        }
      })
      .collect::<Vec<String>>()
      .join("\n");
  }

  let interface_name = interface_decl.id.sym.to_string();

  let mut methods = vec![];
  let mut properties = vec![];
  let mut call_signatures = vec![];

  for type_element in &interface_decl.body.body {
    use swc_ecma_ast::TsTypeElement::*;

    match &type_element {
      TsMethodSignature(ts_method_sig) => {
        let method_js_doc = doc_parser.js_doc_for_span(ts_method_sig.span);
        let method_snippet = doc_parser
          .source_map
          .span_to_snippet(ts_method_sig.span)
          .unwrap();

        let mut params = vec![];

        for param in &ts_method_sig.params {
          use swc_ecma_ast::TsFnParam::*;

          let param_def = match param {
            Ident(ident) => {
              let ts_type = ident
                .type_ann
                .as_ref()
                .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

              doc::ParamDef {
                name: ident.sym.to_string(),
                ts_type,
              }
            }
            _ => doc::ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };

          params.push(param_def);
        }

        let maybe_return_type = ts_method_sig
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        let method_def = doc::InterfaceMethodDef {
          js_doc: method_js_doc,
          snippet: method_snippet,
          location: doc_parser
            .source_map
            .lookup_char_pos(ts_method_sig.span.lo())
            .into(),
          params,
          return_type: maybe_return_type,
        };
        methods.push(method_def);
      }
      TsPropertySignature(ts_prop_sig) => {
        let prop_js_doc = doc_parser.js_doc_for_span(ts_prop_sig.span);
        let prop_snippet = doc_parser
          .source_map
          .span_to_snippet(ts_prop_sig.span)
          .unwrap();

        let name = match &*ts_prop_sig.key {
          swc_ecma_ast::Expr::Ident(ident) => ident.sym.to_string(),
          _ => "TODO".to_string(),
        };

        let mut params = vec![];

        for param in &ts_prop_sig.params {
          use swc_ecma_ast::TsFnParam::*;

          let param_def = match param {
            Ident(ident) => {
              let ts_type = ident
                .type_ann
                .as_ref()
                .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

              doc::ParamDef {
                name: ident.sym.to_string(),
                ts_type,
              }
            }
            _ => doc::ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };

          params.push(param_def);
        }

        let ts_type = ts_prop_sig
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        let prop_def = doc::InterfacePropertyDef {
          name,
          js_doc: prop_js_doc,
          snippet: prop_snippet,
          location: doc_parser
            .source_map
            .lookup_char_pos(ts_prop_sig.span.lo())
            .into(),
          params,
          ts_type,
          computed: ts_prop_sig.computed,
          optional: ts_prop_sig.optional,
        };
        properties.push(prop_def);
      }
      TsCallSignatureDecl(ts_call_sig) => {
        let call_sig_js_doc = doc_parser.js_doc_for_span(ts_call_sig.span);
        let call_sig_snippet = doc_parser
          .source_map
          .span_to_snippet(ts_call_sig.span)
          .unwrap();

        let mut params = vec![];
        for param in &ts_call_sig.params {
          use swc_ecma_ast::TsFnParam::*;

          let param_def = match param {
            Ident(ident) => {
              let ts_type = ident
                .type_ann
                .as_ref()
                .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

              doc::ParamDef {
                name: ident.sym.to_string(),
                ts_type,
              }
            }
            _ => doc::ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };

          params.push(param_def);
        }

        let ts_type = ts_call_sig
          .type_ann
          .as_ref()
          .map(|rt| ts_type_ann_to_def(&doc_parser.source_map, rt));

        let call_sig_def = doc::InterfaceCallSignatureDef {
          js_doc: call_sig_js_doc,
          snippet: call_sig_snippet,
          location: doc_parser
            .source_map
            .lookup_char_pos(ts_call_sig.span.lo())
            .into(),
          params,
          ts_type,
        };
        call_signatures.push(call_sig_def);
      }
      // TODO:
      TsConstructSignatureDecl(_) => {}
      TsIndexSignature(_) => {}
    }
  }

  let interface_def = doc::InterfaceDef {
    methods,
    properties,
    call_signatures,
  };

  doc::DocNode {
    kind: doc::DocNodeKind::Interface,
    name: interface_name,
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
    interface_def: Some(interface_def),
  }
}

fn get_doc_for_ts_enum_decl(
  doc_parser: &DocParser,
  parent_span: Span,
  enum_decl: &swc_ecma_ast::TsEnumDecl,
) -> doc::DocNode {
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

    let member_def = doc::EnumMemberDef { name: member_name };
    members.push(member_def);
  }

  let enum_def = doc::EnumDef { members };

  doc::DocNode {
    kind: doc::DocNodeKind::Enum,
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

fn get_doc_for_ts_namespace_decl(
  doc_parser: &DocParser,
  ts_namespace_decl: &swc_ecma_ast::TsNamespaceDecl,
) -> doc::DocNode {
  let js_doc = doc_parser.js_doc_for_span(ts_namespace_decl.span);
  let snippet = doc_parser
    .source_map
    .span_to_snippet(ts_namespace_decl.span)
    .expect("Snippet not found")
    .trim_end()
    .to_string();

  let namespace_name = ts_namespace_decl.id.sym.to_string();

  use swc_ecma_ast::TsNamespaceBody::*;

  let elements = match &*ts_namespace_decl.body {
    TsModuleBlock(ts_module_block) => {
      get_doc_nodes_for_module_body(doc_parser, ts_module_block.body.clone())
    }
    TsNamespaceDecl(ts_namespace_decl) => {
      vec![get_doc_for_ts_namespace_decl(doc_parser, ts_namespace_decl)]
    }
  };

  let ns_def = doc::NamespaceDef { elements };

  doc::DocNode {
    kind: doc::DocNodeKind::Namespace,
    name: namespace_name,
    snippet,
    location: doc_parser
      .source_map
      .lookup_char_pos(ts_namespace_decl.span.lo())
      .into(),
    js_doc,
    function_def: None,
    variable_def: None,
    enum_def: None,
    class_def: None,
    type_alias_def: None,
    namespace_def: Some(ns_def),
    interface_def: None,
  }
}

fn get_doc_for_ts_module(
  doc_parser: &DocParser,
  parent_span: Span,
  ts_module_decl: &swc_ecma_ast::TsModuleDecl,
) -> doc::DocNode {
  let js_doc = doc_parser.js_doc_for_span(parent_span);
  let snippet = doc_parser
    .source_map
    .span_to_snippet(parent_span)
    .expect("Snippet not found")
    .trim_end()
    .to_string();

  use swc_ecma_ast::TsModuleName;
  let namespace_name = match &ts_module_decl.id {
    TsModuleName::Ident(ident) => ident.sym.to_string(),
    TsModuleName::Str(str_) => str_.value.to_string(),
  };

  let elements = if let Some(body) = &ts_module_decl.body {
    use swc_ecma_ast::TsNamespaceBody::*;

    match &body {
      TsModuleBlock(ts_module_block) => {
        get_doc_nodes_for_module_body(doc_parser, ts_module_block.body.clone())
      }
      TsNamespaceDecl(ts_namespace_decl) => {
        vec![get_doc_for_ts_namespace_decl(doc_parser, ts_namespace_decl)]
      }
    }
  } else {
    vec![]
  };

  let ns_def = doc::NamespaceDef { elements };

  doc::DocNode {
    kind: doc::DocNodeKind::Namespace,
    name: namespace_name,
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
    namespace_def: Some(ns_def),
    interface_def: None,
  }
}

pub fn get_doc_node_for_export_decl(
  doc_parser: &DocParser,
  export_decl: &swc_ecma_ast::ExportDecl,
) -> doc::DocNode {
  let export_span = export_decl.span();
  use swc_ecma_ast::Decl;
  match &export_decl.decl {
    Decl::Class(class_decl) => {
      get_doc_for_class_decl(doc_parser, export_span, class_decl)
    }
    Decl::Fn(fn_decl) => get_doc_for_fn_decl(doc_parser, export_span, fn_decl),
    Decl::Var(var_decl) => {
      get_doc_for_var_decl(doc_parser, export_span, var_decl)
    }
    Decl::TsInterface(ts_interface_decl) => {
      get_doc_for_ts_interface_decl(doc_parser, export_span, ts_interface_decl)
    }
    Decl::TsTypeAlias(ts_type_alias) => {
      get_doc_for_ts_type_alias_decl(doc_parser, export_span, ts_type_alias)
    }
    Decl::TsEnum(ts_enum) => {
      get_doc_for_ts_enum_decl(doc_parser, export_span, ts_enum)
    }
    Decl::TsModule(ts_module) => {
      get_doc_for_ts_module(doc_parser, export_span, ts_module)
    }
  }
}

pub fn get_doc_nodes_for_named_export(
  _doc_parser: &DocParser,
  named_export: &swc_ecma_ast::NamedExport,
) -> Vec<doc::DocNode> {
  let file_name = named_export.src.as_ref().expect("").value.to_string();
  // TODO: resolve specifier
  let source_code =
    std::fs::read_to_string(&file_name).expect("Failed to read file");
  let doc_nodes =
    get_docs(file_name, source_code).expect("Failed to print docs");
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

  let reexports_docs: Vec<doc::DocNode> = doc_nodes
    .into_iter()
    .filter(|doc_node| reexports.contains(&doc_node.name))
    .collect();

  reexports_docs
}

pub fn get_doc_nodes_for_module_decl(
  doc_parser: &DocParser,
  module_decl: &swc_ecma_ast::ModuleDecl,
) -> Vec<doc::DocNode> {
  use swc_ecma_ast::ModuleDecl;

  match module_decl {
    ModuleDecl::ExportDecl(export_decl) => {
      vec![get_doc_node_for_export_decl(doc_parser, export_decl)]
    }
    ModuleDecl::ExportNamed(named_export) => {
      get_doc_nodes_for_named_export(doc_parser, named_export)
    }
    ModuleDecl::ExportDefaultDecl(_) => vec![],
    ModuleDecl::ExportDefaultExpr(_) => vec![],
    ModuleDecl::ExportAll(_) => vec![],
    ModuleDecl::TsExportAssignment(_) => vec![],
    ModuleDecl::TsNamespaceExport(_) => vec![],
    _ => vec![],
  }
}

fn get_doc_nodes_for_module_body(
  doc_parser: &DocParser,
  module_body: Vec<swc_ecma_ast::ModuleItem>,
) -> Vec<doc::DocNode> {
  let mut doc_entries: Vec<doc::DocNode> = vec![];
  for node in module_body.iter() {
    if let swc_ecma_ast::ModuleItem::ModuleDecl(module_decl) = node {
      doc_entries
        .extend(get_doc_nodes_for_module_decl(&doc_parser, module_decl));
    }
  }
  doc_entries
}

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

    let doc_entries = get_doc_nodes_for_module_body(&doc_parser, module.body);
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
