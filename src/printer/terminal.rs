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
        DocNodeKind::Variable => println!("A variable!"),
        DocNodeKind::Class => println!("An enum!"),
        DocNodeKind::Enum => println!("A class!"),
        DocNodeKind::Interface => println!("A class!"),
        DocNodeKind::TypeAlias => println!("A type alias!"),
        DocNodeKind::Namespace => println!("A namespace!"),
      }
    }
  }

  pub fn render_params(&self, params: Vec<doc::ParamDef>) -> String {
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

  pub fn print_function(&self, node: doc::DocNode) {
    let function_def = node.function_def.unwrap();
    let return_type = function_def.return_type.unwrap();
    println!(
      "function {}({}): {}",
      node.name,
      self.render_params(function_def.params),
      return_type.repr
    )
  }
}
