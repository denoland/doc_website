use super::doc;

pub mod json;
pub mod terminal;

pub trait Printer {
  fn print(&self, doc_nodes: Vec<doc::DocNode>);
  fn print_details(&self, node: doc::DocNode);
}
