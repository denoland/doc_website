use crate::doc;

#[derive(Debug)]
pub struct JSONPrinter {
  pretty_print: bool,
}

impl JSONPrinter {
  pub fn new(pretty_print: bool) -> JSONPrinter {
    JSONPrinter { pretty_print }
  }

  pub fn print(&self, doc_nodes: Vec<doc::DocNode>) {
    let docs_json = if self.pretty_print {
      serde_json::to_string_pretty(&doc_nodes).unwrap()
    } else {
      serde_json::to_string(&doc_nodes).unwrap()
    };
    println!("{}", docs_json);
  }
}
