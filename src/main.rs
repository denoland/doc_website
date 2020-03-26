pub mod doc;

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

  let docs_json = serde_json::to_string_pretty(&doc_nodes).unwrap();

  println!("{}", docs_json);
}
