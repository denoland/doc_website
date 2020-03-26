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
    let node = doc_nodes.iter().find(|node| node.name == name);
    if node.is_some() {
      printer.print_details(node.unwrap().clone());
    } else {
      println!("error: Node {} was not found!", name)
    }
    std::process::exit(0);
  }
  printer.print(doc_nodes);
}
