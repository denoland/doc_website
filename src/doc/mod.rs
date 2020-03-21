#![allow(unused)]

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

#[derive(Debug)]
pub enum DocNodeKind {
  Function,
  Variable,
  Class,
  Enum,
  Interface,
  TypeAlias,
  Namespace,
}

#[derive(Debug)]
pub struct TsTypeDef {
  pub repr: String,
}

#[derive(Debug)]
pub struct ArgDef {
  pub name: String,
  pub type_: TsTypeDef,
}

#[derive(Debug)]
pub struct FunctionDef {
  pub args: Vec<ArgDef>,
  pub return_type: Option<TsTypeDef>,
  pub is_async: bool,
  pub is_generator: bool,
  // TODO: type_params, decorators
}
#[derive(Debug)]
pub enum VariableKind {}

#[derive(Debug)]
pub struct VariableDef {
  type_: TsTypeDef,
  kind: swc_ecma_ast::VarDeclKind,
}
#[derive(Debug)]
pub struct EnumMemberDef {
  pub name: String,
}
#[derive(Debug)]
pub struct EnumDef {
  pub members: Vec<EnumMemberDef>,
}
#[derive(Debug)]
pub struct ClassConstructorDef {}
#[derive(Debug)]
pub struct ClassPropertyDef {}
#[derive(Debug)]
pub struct ClassMethodDef {}
#[derive(Debug)]
pub struct ClassDef {
  pub constructors: Vec<ClassConstructorDef>,
  pub properties: Vec<ClassConstructorDef>,
  pub methods: Vec<ClassConstructorDef>,
}
#[derive(Debug)]
pub struct TypeAliasDef {}
#[derive(Debug)]
pub struct NamespaceDef {}

#[derive(Debug)]
pub struct InterfaceDef {
  // TODO: extends, type params
// TODO: elements https://docs.rs/swc_ecma_ast/0.18.1/swc_ecma_ast/enum.TsTypeElement.html
}

#[derive(Debug)]
pub struct DocNode {
  pub kind: DocNodeKind,
  pub name: String,
  pub snippet: String,
  pub location: swc_common::Loc,
  pub js_doc: Option<String>,
  pub function_def: Option<FunctionDef>,
  pub variable_def: Option<VariableDef>,
  pub enum_def: Option<EnumDef>,
  pub class_def: Option<ClassDef>,
  pub type_alias_def: Option<TypeAliasDef>,
  pub namespace_def: Option<NamespaceDef>,
  pub interface_def: Option<InterfaceDef>,
}
