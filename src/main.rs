pub mod doc;
use crate::printer::json::JSONPrinter;
use crate::printer::terminal::TerminalPrinter;
mod printer;

#[cfg(test)]
mod tests;

fn main() {
  let args: Vec<String> = std::env::args().collect();

  if args.len() < 2 {
    eprintln!("Missing file name");
    std::process::exit(1);
  }

  let file_name = args[1].to_string();
  let source_code =
    std::fs::read_to_string(&file_name).expect("Failed to read file");
  let doc_parser = doc::DocParser::default();
  let doc_nodes = doc_parser
    .parse(file_name, source_code)
    .expect("Failed to parse docs");

  if args.len() > 2 && args[2] == "--raw" {
    let printer = JSONPrinter::new(false);
    printer.print(doc_nodes);
    std::process::exit(0);
  }

  let printer = TerminalPrinter::new();
  if args.len() == 3 {
    let name = args[2].clone();
    let node = find_node_by_name_recursively(doc_nodes, name.clone());
    if let Some(node) = node {
      printer.print_details(node);
    } else {
      println!("error: Node {} was not found!", name)
    }
    std::process::exit(0);
  }
  printer.print(doc_nodes);
}

fn find_node_by_name_recursively(
  doc_nodes: Vec<doc::DocNode>,
  name: String,
) -> Option<doc::DocNode> {
  let mut parts = name.splitn(2, '.');
  let name = parts.next();
  let leftover = parts.next();
  name?;
  let node = find_node_by_name(doc_nodes, name.unwrap().to_string());
  match node {
    Some(node) => match node.kind {
      doc::DocNodeKind::Namespace => {
        if let Some(leftover) = leftover {
          find_node_by_name_recursively(
            node.namespace_def.unwrap().elements,
            leftover.to_string(),
          )
        } else {
          Some(node)
        }
      }
      _ => {
        if leftover.is_none() {
          Some(node)
        } else {
          None
        }
      }
    },
    _ => None,
  }
}

fn find_node_by_name(
  doc_nodes: Vec<doc::DocNode>,
  name: String,
) -> Option<doc::DocNode> {
  let node = doc_nodes.iter().find(|node| node.name == name);
  match node {
    Some(node) => Some(node.clone()),
    None => None,
  }
}
