use crate::doc;
use crate::doc::ts_type::TsTypeDefKind;
use crate::doc::DocNodeKind;

#[derive(Debug)]
pub struct TerminalPrinter {}

impl TerminalPrinter {
  pub fn new() -> TerminalPrinter {
    TerminalPrinter {}
  }

  pub fn print(&self, doc_nodes: Vec<doc::DocNode>) {
    self.print_(doc_nodes, 0);
  }

  fn print_(&self, doc_nodes: Vec<doc::DocNode>, indent: i64) {
    for node in doc_nodes {
      match node.kind {
        DocNodeKind::Function => self.print_function(node, indent),
        DocNodeKind::Variable => self.print_variable(node, indent),
        DocNodeKind::Class => self.print_class(node, indent),
        DocNodeKind::Enum => self.print_enum(node, indent),
        DocNodeKind::Interface => self.print_interface(node, indent),
        DocNodeKind::TypeAlias => self.print_type_alias(node, indent),
        DocNodeKind::Namespace => self.print_namespace(node, indent),
      }
    }
  }

  fn render_params(&self, params: Vec<doc::ParamDef>) -> String {
    let mut rendered = String::from("");
    if params.len() > 0 {
      for param in params {
        rendered.push_str(param.name.as_str());
        if param.ts_type.is_some() {
          rendered.push_str(": ");
          rendered
            .push_str(self.render_ts_type(param.ts_type.unwrap()).as_str());
        }
        rendered.push_str(", ");
      }
      rendered.truncate(rendered.len() - 2);
    }
    rendered
  }

  fn render_ts_type(&self, ts_type: doc::ts_type::TsTypeDef) -> String {
    let kind = ts_type.kind.unwrap();
    match kind {
      TsTypeDefKind::Array => {
        format!("{}[]", self.render_ts_type(*ts_type.array.unwrap()))
      }
      TsTypeDefKind::Conditional => {
        let conditional = ts_type.conditional_type.unwrap();
        format!(
          "{} extends {} ? {} : {}",
          self.render_ts_type(*conditional.check_type),
          self.render_ts_type(*conditional.extends_type),
          self.render_ts_type(*conditional.true_type),
          self.render_ts_type(*conditional.false_type)
        )
      }
      TsTypeDefKind::FnOrConstructor => {
        let fn_or_constructor = ts_type.fn_or_constructor.unwrap();
        format!(
          "{}({}) => {}",
          if fn_or_constructor.constructor {
            "new "
          } else {
            ""
          },
          self.render_params(fn_or_constructor.params),
          self.render_ts_type(fn_or_constructor.ts_type),
        )
      }
      TsTypeDefKind::IndexedAccess => {
        let indexed_access = ts_type.indexed_access.unwrap();
        format!(
          "{}[{}]",
          self.render_ts_type(*indexed_access.obj_type),
          self.render_ts_type(*indexed_access.index_type)
        )
      }
      TsTypeDefKind::Intersection => {
        let intersection = ts_type.intersection.unwrap();
        let mut output = "".to_string();
        if intersection.len() > 0 {
          for ts_type in intersection {
            output.push_str(self.render_ts_type(ts_type).as_str());
            output.push_str(" & ")
          }
          output.truncate(output.len() - 3);
        }
        output
      }
      TsTypeDefKind::Keyword => ts_type.keyword.unwrap(),
      TsTypeDefKind::Literal => {
        let literal = ts_type.literal.unwrap();
        match literal.kind {
          doc::ts_type::LiteralDefKind::Boolean => {
            format!("{}", literal.boolean.unwrap())
          }
          doc::ts_type::LiteralDefKind::String => literal.string.unwrap(),
          doc::ts_type::LiteralDefKind::Number => {
            format!("{}", literal.number.unwrap())
          }
        }
      }
      TsTypeDefKind::Optional => "_optional_".to_string(),
      TsTypeDefKind::Parenthesized => {
        format!("({})", self.render_ts_type(*ts_type.parenthesized.unwrap()))
      }
      TsTypeDefKind::Rest => {
        format!("...{}", self.render_ts_type(*ts_type.rest.unwrap()))
      }
      TsTypeDefKind::This => "this".to_string(),
      TsTypeDefKind::Tuple => {
        let tuple = ts_type.tuple.unwrap();
        let mut output = "".to_string();
        if tuple.len() > 0 {
          for ts_type in tuple {
            output.push_str(self.render_ts_type(ts_type).as_str());
            output.push_str(", ")
          }
          output.truncate(output.len() - 2);
        }
        output
      }
      TsTypeDefKind::TypeLiteral => ts_type.repr,
      TsTypeDefKind::TypeOperator => {
        let operator = ts_type.type_operator.unwrap();
        format!(
          "{} {}",
          operator.operator,
          self.render_ts_type(operator.ts_type)
        )
      }
      TsTypeDefKind::TypeQuery => {
        format!("typeof {}", ts_type.type_query.unwrap())
      }
      TsTypeDefKind::TypeRef => {
        let type_ref = ts_type.type_ref.unwrap();
        let mut final_output = type_ref.type_name;
        if type_ref.type_params.is_some() {
          let mut output = "".to_string();
          let type_params = type_ref.type_params.unwrap();
          if type_params.len() > 0 {
            for ts_type in type_params {
              output.push_str(self.render_ts_type(ts_type).as_str());
              output.push_str(", ")
            }
            output.truncate(output.len() - 2);
          }
          final_output.push_str(format!("<{}>", output).as_str());
        }
        final_output
      }
      TsTypeDefKind::Union => {
        let union = ts_type.union.unwrap();
        let mut output = "".to_string();
        if union.len() > 0 {
          for ts_type in union {
            output.push_str(self.render_ts_type(ts_type).as_str());
            output.push_str(" | ")
          }
          output.truncate(output.len() - 3);
        }
        output
      }
    }
  }

  fn print_indent(&self, indent: i64) {
    for _ in 0..indent {
      print!("  ")
    }
  }

  fn print_jsdoc(&self, indent: i64, jsdoc: String) {
    self.print_indent(indent + 1);
    let first_line =
      jsdoc.split("\n\n").next().unwrap_or("").replace("\n", " ");
    println!("{}", first_line)
  }

  fn print_function(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    let function_def = node.function_def.unwrap();
    let return_type = function_def.return_type.unwrap();
    println!(
      "function {}({}): {}",
      node.name,
      self.render_params(function_def.params),
      self.render_ts_type(return_type).as_str()
    );
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_class(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    println!("class {}", node.name);
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_variable(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    let variable_def = node.variable_def.unwrap();
    println!(
      "{} {}{}",
      match variable_def.kind {
        swc_ecma_ast::VarDeclKind::Const => "const".to_string(),
        swc_ecma_ast::VarDeclKind::Let => "let".to_string(),
        swc_ecma_ast::VarDeclKind::Var => "var".to_string(),
      },
      node.name,
      if variable_def.ts_type.is_some() {
        format!(": {}", self.render_ts_type(variable_def.ts_type.unwrap()))
      } else {
        "".to_string()
      }
    );
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_enum(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    println!("enum {}", node.name);
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_interface(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    println!("interface {}", node.name);
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_type_alias(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    println!("type {}", node.name);
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
  }

  fn print_namespace(&self, node: doc::DocNode, indent: i64) {
    self.print_indent(indent);
    let namespace_def = node.namespace_def.unwrap();
    println!("namespace {}", node.name);
    if node.js_doc.is_some() {
      self.print_jsdoc(indent, node.js_doc.unwrap());
    }
    println!("");
    self.print_(namespace_def.elements, indent + 1);
    println!("");
  }
}
