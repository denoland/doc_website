use serde::Serialize;
use swc_common;

pub mod class;
pub mod r#enum;
pub mod function;
pub mod interface;
pub mod module;
pub mod namespace;
pub mod parser;
pub mod ts_type;
pub mod type_alias;
pub mod variable;

use class::ClassDef;
use function::FunctionDef;
use interface::InterfaceDef;
use namespace::NamespaceDef;
use r#enum::EnumDef;
use ts_type::TsTypeDef;
use type_alias::TypeAliasDef;
use variable::VariableDef;

#[derive(Debug, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum DocNodeKind {
  Function,
  Variable,
  Class,
  Enum,
  Interface,
  TypeAlias,
  Namespace,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ParamDef {
  pub name: String,
  pub ts_type: Option<TsTypeDef>,
}

#[derive(Debug, Serialize)]
pub struct Location {
  filename: String,
  line: usize,
  col: usize,
}

impl Into<Location> for swc_common::Loc {
  fn into(self) -> Location {
    use swc_common::FileName::*;

    let filename = match &self.file.name {
      Real(path_buf) => path_buf.to_string_lossy().to_string(),
      Custom(str_) => str_.to_string(),
      _ => panic!("invalid filename"),
    };

    Location {
      filename,
      line: self.line,
      col: self.col_display,
    }
  }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocNode {
  pub kind: DocNodeKind,
  pub name: String,
  pub snippet: String,
  pub location: Location,
  pub js_doc: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub function_def: Option<FunctionDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub variable_def: Option<VariableDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub enum_def: Option<EnumDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub class_def: Option<ClassDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub type_alias_def: Option<TypeAliasDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub namespace_def: Option<NamespaceDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub interface_def: Option<InterfaceDef>,
}
