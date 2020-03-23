use serde::Serialize;
use swc_common;
use swc_ecma_ast;

pub mod parser;
pub mod ts_type;

use ts_type::TsTypeDef;

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
#[serde(rename_all = "camelCase")]
pub struct FunctionDef {
  pub params: Vec<ParamDef>,
  pub return_type: Option<TsTypeDef>,
  pub is_async: bool,
  pub is_generator: bool,
  // TODO: type_params, decorators
}

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
#[serde(rename_all = "camelCase")]
pub struct ClassConstructorDef {
  pub js_doc: Option<String>,
  pub snippet: String,
  pub accessibility: Option<swc_ecma_ast::Accessibility>,
  pub name: String,
  pub params: Vec<ParamDef>,
  pub location: Location,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassPropertyDef {
  pub js_doc: Option<String>,
  pub snippet: String,
  pub ts_type: Option<TsTypeDef>,
  pub readonly: bool,
  pub accessibility: Option<swc_ecma_ast::Accessibility>,
  pub is_abstract: bool,
  pub is_static: bool,
  pub name: String,
  pub location: Location,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassMethodDef {
  pub js_doc: Option<String>,
  pub snippet: String,
  //   pub ts_type: Option<TsTypeDef>,
  //   pub readonly: bool,
  pub accessibility: Option<swc_ecma_ast::Accessibility>,
  pub is_abstract: bool,
  pub is_static: bool,
  pub name: String,
  pub kind: swc_ecma_ast::MethodKind,
  pub function_def: FunctionDef,
  pub location: Location,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClassDef {
  // TODO: decorators, super_class, implements,
  // type_params, super_type_params
  pub is_abstract: bool,
  pub constructors: Vec<ClassConstructorDef>,
  pub properties: Vec<ClassPropertyDef>,
  pub methods: Vec<ClassMethodDef>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeAliasDef {
  pub ts_type: TsTypeDef,
  // TODO: type_params
}

#[derive(Debug, Serialize)]
pub struct NamespaceDef {
  pub elements: Vec<DocNode>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InterfaceMethodDef {
  // TODO: type_params
  // pub name: String,
  pub snippet: String,
  pub location: Location,
  pub js_doc: Option<String>,
  pub params: Vec<ParamDef>,
  pub return_type: Option<TsTypeDef>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InterfacePropertyDef {
  // TODO: type_params
  pub name: String,
  pub snippet: String,
  pub location: Location,
  pub js_doc: Option<String>,
  pub params: Vec<ParamDef>,
  pub computed: bool,
  pub optional: bool,
  pub ts_type: Option<TsTypeDef>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InterfaceCallSignatureDef {
  // TODO: type_params
  pub snippet: String,
  pub location: Location,
  pub js_doc: Option<String>,
  pub params: Vec<ParamDef>,
  pub ts_type: Option<TsTypeDef>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InterfaceDef {
  // TODO: extends, type params
  pub methods: Vec<InterfaceMethodDef>,
  pub properties: Vec<InterfacePropertyDef>,
  pub call_signatures: Vec<InterfaceCallSignatureDef>,
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
