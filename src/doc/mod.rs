#![allow(unused)]

use serde::Serialize;

use swc_common;

use swc_ecma_ast;

// export interface DocEntry {
//  kind: "class" | "method" | "property" | "enum" | "enumMember";
//  name: string;
//  typestr?: string;
//  docstr?: string;
//  args?: ArgEntry[];
//  retType?: string;
//  sourceUrl?: string;
// }

// export interface ArgEntry {
//  name: string;
//  typestr?: string;
//  docstr?: string;
// }

#[derive(Debug, Serialize)]
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
pub struct TsTypeDef {
  pub repr: String,
}

#[derive(Debug, Serialize)]
pub struct ArgDef {
  pub name: String,
  pub type_: TsTypeDef,
}

#[derive(Debug, Serialize)]
pub struct FunctionDef {
  pub args: Vec<ArgDef>,
  pub return_type: Option<TsTypeDef>,
  pub is_async: bool,
  pub is_generator: bool,
  // TODO: type_params, decorators
}
#[derive(Debug, Serialize)]
pub enum VariableKind {}

#[derive(Debug, Serialize)]
pub struct VariableDef {
  type_: TsTypeDef,
  kind: swc_ecma_ast::VarDeclKind,
}
#[derive(Debug, Serialize)]
pub struct EnumMemberDef {
  pub name: String,
}
#[derive(Debug, Serialize)]
pub struct EnumDef {
  pub members: Vec<EnumMemberDef>,
}
#[derive(Debug, Serialize)]
pub struct ClassConstructorDef {}
#[derive(Debug, Serialize)]
pub struct ClassPropertyDef {}
#[derive(Debug, Serialize)]
pub struct ClassMethodDef {}
#[derive(Debug, Serialize)]
pub struct ClassDef {
  pub constructors: Vec<ClassConstructorDef>,
  pub properties: Vec<ClassConstructorDef>,
  pub methods: Vec<ClassConstructorDef>,
}
#[derive(Debug, Serialize)]
pub struct TypeAliasDef {}
#[derive(Debug, Serialize)]
pub struct NamespaceDef {}

#[derive(Debug, Serialize)]
pub struct InterfaceDef {
  // TODO: extends, type params
// TODO: elements https://docs.rs/swc_ecma_ast/0.18.1/swc_ecma_ast/enum.TsTypeElement.html
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
