use crate::doc;
use crate::doc::DocNodeKind;

#[derive(Debug)]
pub struct TerminalPrinter {}

impl TerminalPrinter {
  pub fn new() -> TerminalPrinter {
    TerminalPrinter {}
  }

  pub fn print(&self, doc_nodes: Vec<doc::DocNode>) {
    for node in doc_nodes {
      match node.kind {
        DocNodeKind::Function => self.print_function(node),
        DocNodeKind::Variable => self.print_variable(node),
        DocNodeKind::Class => self.print_class(node),
        DocNodeKind::Enum => self.print_enum(node),
        DocNodeKind::Interface => self.print_interface(node),
        DocNodeKind::TypeAlias => self.print_type_alias(node),
        DocNodeKind::Namespace => self.print_namespace(node),
      }
    }
  }

  fn render_params(&self, params: Vec<doc::ParamDef>) -> String {
    let mut rendered = String::from("");
    for param in params {
      rendered.push_str(param.name.as_str());
      if param.ts_type.is_some() {
        rendered.push_str(": ");
        rendered.push_str(param.ts_type.unwrap().repr.as_str());
      }
      rendered.push_str(", ");
    }
    rendered.truncate(rendered.len() - 2);
    rendered
  }

  fn print_function(&self, node: doc::DocNode) {
    let function_def = node.function_def.unwrap();
    let return_type = function_def.return_type.unwrap();
    println!(
      "function {}({}): {}",
      node.name,
      self.render_params(function_def.params),
      return_type.repr
    )
  }

  fn print_class(&self, node: doc::DocNode) {
    println!("class {}", node.name)
  }

  fn print_variable(&self, node: doc::DocNode) {
    println!("variable {}", node.name)
  }

  fn print_enum(&self, node: doc::DocNode) {
    println!("enum {}", node.name)
  }

  fn print_interface(&self, node: doc::DocNode) {
    println!("interface {}", node.name)
  }

  fn print_type_alias(&self, node: doc::DocNode) {
    println!("type {}", node.name)
  }

  fn print_namespace(&self, node: doc::DocNode) {
    println!("namespace {}", node.name)
  }
}
