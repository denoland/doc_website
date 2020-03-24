use super::ParamDef;
use serde::Serialize;
use swc_common::SourceMap;
use swc_ecma_ast;
use swc_ecma_ast::TsArrayType;
use swc_ecma_ast::TsFnOrConstructorType;
use swc_ecma_ast::TsKeywordType;
use swc_ecma_ast::TsLit;
use swc_ecma_ast::TsLitType;
use swc_ecma_ast::TsOptionalType;
use swc_ecma_ast::TsParenthesizedType;
use swc_ecma_ast::TsRestType;
use swc_ecma_ast::TsThisType;
use swc_ecma_ast::TsTupleType;
use swc_ecma_ast::TsType;
use swc_ecma_ast::TsTypeAnn;
use swc_ecma_ast::TsTypeOperator;
use swc_ecma_ast::TsTypeQuery;
use swc_ecma_ast::TsTypeRef;
use swc_ecma_ast::TsUnionOrIntersectionType;

// pub enum TsType {
//  *      TsKeywordType(TsKeywordType),
//  *      TsThisType(TsThisType),
//  *      TsFnOrConstructorType(TsFnOrConstructorType),
//  *      TsTypeRef(TsTypeRef),
//  *      TsTypeQuery(TsTypeQuery),
//     TsTypeLit(TsTypeLit),
//  *      TsArrayType(TsArrayType),
//  *      TsTupleType(TsTupleType),
//  *      TsOptionalType(TsOptionalType),
//  *      TsRestType(TsRestType),
//  *      TsUnionOrIntersectionType(TsUnionOrIntersectionType),
//     TsConditionalType(TsConditionalType),
//     TsInferType(TsInferType),
//  *      TsParenthesizedType(TsParenthesizedType),
//  *      TsTypeOperator(TsTypeOperator),
//     TsIndexedAccessType(TsIndexedAccessType),
//     TsMappedType(TsMappedType),
//  *      TsLitType(TsLitType),
//     TsTypePredicate(TsTypePredicate),
//     TsImportType(TsImportType),
// }

impl Into<TsTypeDef> for &TsLitType {
  fn into(self) -> TsTypeDef {
    let (repr, lit) = match &self.lit {
      TsLit::Number(num) => {
        (format!("{}", num.value), LiteralDef::Number(num.value))
      }
      TsLit::Str(str_) => (
        str_.value.to_string(),
        LiteralDef::Str(str_.value.to_string()),
      ),
      TsLit::Bool(bool_) => {
        (bool_.value.to_string(), LiteralDef::Bool(bool_.value))
      }
    };

    TsTypeDef {
      repr,
      literal: Some(lit),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsArrayType {
  fn into(self) -> TsTypeDef {
    let ts_type_def: TsTypeDef = (&*self.elem_type).into();

    TsTypeDef {
      array: Some(Box::new(ts_type_def)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsTupleType {
  fn into(self) -> TsTypeDef {
    let mut type_defs = vec![];

    for type_box in &self.elem_types {
      let ts_type: &TsType = &(*type_box);
      let def: TsTypeDef = ts_type.into();
      type_defs.push(def)
    }

    TsTypeDef {
      tuple: Some(type_defs),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsUnionOrIntersectionType {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsUnionOrIntersectionType::*;

    match self {
      TsUnionType(union_type) => {
        let mut types_union = vec![];

        for type_box in &union_type.types {
          let ts_type: &TsType = &(*type_box);
          let def: TsTypeDef = ts_type.into();
          types_union.push(def);
        }

        TsTypeDef {
          union: Some(types_union),
          ..Default::default()
        }
      }
      TsIntersectionType(intersection_type) => {
        let mut types_intersection = vec![];

        for type_box in &intersection_type.types {
          let ts_type: &TsType = &(*type_box);
          let def: TsTypeDef = ts_type.into();
          types_intersection.push(def);
        }

        TsTypeDef {
          intersection: Some(types_intersection),
          ..Default::default()
        }
      }
    }
  }
}

impl Into<TsTypeDef> for &TsKeywordType {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsKeywordTypeKind::*;

    let keyword_str = match self.kind {
      TsAnyKeyword => "any",
      TsUnknownKeyword => "unknown",
      TsNumberKeyword => "number",
      TsObjectKeyword => "object",
      TsBooleanKeyword => "boolean",
      TsBigIntKeyword => "BigInt",
      TsStringKeyword => "string",
      TsSymbolKeyword => "symbol",
      TsVoidKeyword => "void",
      TsUndefinedKeyword => "undefined",
      TsNullKeyword => "null",
      TsNeverKeyword => "never",
    };

    TsTypeDef {
      repr: keyword_str.to_string(),
      keyword: Some(keyword_str.to_string()),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsTypeOperator {
  fn into(self) -> TsTypeDef {
    let ts_type = (&*self.type_ann).into();
    let type_operator_def = TsTypeOperatorDef {
      operator: self.op.as_str().to_string(),
      ts_type,
    };

    TsTypeDef {
      type_operator: Some(Box::new(type_operator_def)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsParenthesizedType {
  fn into(self) -> TsTypeDef {
    let ts_type = (&*self.type_ann).into();

    TsTypeDef {
      parenthesized: Some(Box::new(ts_type)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsRestType {
  fn into(self) -> TsTypeDef {
    let ts_type = (&*self.type_ann).into();

    TsTypeDef {
      rest: Some(Box::new(ts_type)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsOptionalType {
  fn into(self) -> TsTypeDef {
    let ts_type = (&*self.type_ann).into();

    TsTypeDef {
      optional: Some(Box::new(ts_type)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsThisType {
  fn into(self) -> TsTypeDef {
    TsTypeDef {
      repr: "this".to_string(),
      this: Some(true),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsTypeQuery {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsEntityName::*;
    use swc_ecma_ast::TsTypeQueryExpr::*;

    let type_name = match &self.expr_name {
      TsEntityName(entity_name) => match entity_name {
        Ident(ident) => ident.sym.to_string(),
        TsQualifiedName(_) => "<UNIMPLEMENTED>".to_string(),
      },
      Import(import_type) => import_type.arg.value.to_string(),
    };

    TsTypeDef {
      repr: type_name.to_string(),
      type_query: Some(type_name),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsTypeRef {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsEntityName::*;

    let type_name = match &self.type_name {
      Ident(ident) => ident.sym.to_string(),
      TsQualifiedName(_) => "<UNIMPLEMENTED>".to_string(),
    };

    TsTypeDef {
      repr: type_name.to_string(),
      type_ref: Some(TsTypeRefDef { type_name }),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsFnOrConstructorType {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsFnOrConstructorType::*;

    let fn_def = match self {
      TsFnType(ts_fn_type) => {
        let mut params = vec![];

        for param in &ts_fn_type.params {
          use swc_ecma_ast::TsFnParam::*;

          let param_def = match param {
            Ident(ident) => {
              let ts_type: Option<TsTypeDef> =
                ident.type_ann.as_ref().map(|rt| {
                  let type_box = &*rt.type_ann;
                  (&*type_box).into()
                });

              ParamDef {
                name: ident.sym.to_string(),
                ts_type,
              }
            }
            _ => ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };

          params.push(param_def);
        }

        TsFnOrConstructorDef {
          constructor: false,
          ts_type: (&*ts_fn_type.type_ann.type_ann).into(),
          params,
        }
      }
      TsConstructorType(ctor_type) => {
        let mut params = vec![];

        for param in &ctor_type.params {
          use swc_ecma_ast::TsFnParam::*;

          let param_def = match param {
            Ident(ident) => {
              let ts_type: Option<TsTypeDef> =
                ident.type_ann.as_ref().map(|rt| {
                  let type_box = &*rt.type_ann;
                  (&*type_box).into()
                });

              ParamDef {
                name: ident.sym.to_string(),
                ts_type,
              }
            }
            _ => ParamDef {
              name: "<TODO>".to_string(),
              ts_type: None,
            },
          };

          params.push(param_def);
        }

        TsFnOrConstructorDef {
          constructor: true,
          ts_type: (&*ctor_type.type_ann.type_ann).into(),
          params: vec![],
        }
      }
    };

    TsTypeDef {
      fn_or_constructor: Some(Box::new(fn_def)),
      ..Default::default()
    }
  }
}

impl Into<TsTypeDef> for &TsType {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsType::*;

    match self {
      TsKeywordType(ref keyword_type) => keyword_type.into(),
      TsLitType(ref lit_type) => lit_type.into(),
      TsTypeRef(ref type_ref) => type_ref.into(),
      TsUnionOrIntersectionType(union_or_inter) => union_or_inter.into(),
      TsArrayType(array_type) => array_type.into(),
      TsTupleType(tuple_type) => tuple_type.into(),
      TsTypeOperator(type_op_type) => type_op_type.into(),
      TsParenthesizedType(paren_type) => paren_type.into(),
      TsRestType(rest_type) => rest_type.into(),
      TsOptionalType(optional_type) => optional_type.into(),
      TsTypeQuery(type_query) => type_query.into(),
      TsThisType(this_type) => this_type.into(),
      TsFnOrConstructorType(fn_or_con_type) => fn_or_con_type.into(),
      _ => TsTypeDef {
        repr: "<UNIMPLEMENTED>".to_string(),
        ..Default::default()
      },
    }
  }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TsTypeRefDef {
  // TODO: type_params
  type_name: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum LiteralDef {
  Number(f64),
  Str(String),
  Bool(bool),
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TsTypeOperatorDef {
  pub operator: String,
  pub ts_type: TsTypeDef,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TsFnOrConstructorDef {
  // TODO: type_params
  pub constructor: bool,
  pub ts_type: TsTypeDef,
  pub params: Vec<ParamDef>,
}

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TsTypeDef {
  pub repr: String,
  // TODO: make this struct more conrete
  #[serde(skip_serializing_if = "Option::is_none")]
  pub keyword: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub literal: Option<LiteralDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub type_ref: Option<TsTypeRefDef>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub union: Option<Vec<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub intersection: Option<Vec<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub array: Option<Box<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub tuple: Option<Vec<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub type_operator: Option<Box<TsTypeOperatorDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub parenthesized: Option<Box<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub rest: Option<Box<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub optional: Option<Box<TsTypeDef>>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub type_query: Option<String>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub this: Option<bool>,

  #[serde(skip_serializing_if = "Option::is_none")]
  pub fn_or_constructor: Option<Box<TsFnOrConstructorDef>>,
}

pub fn ts_type_ann_to_def(
  source_map: &SourceMap,
  type_ann: &TsTypeAnn,
) -> TsTypeDef {
  use swc_ecma_ast::TsType::*;

  match &*type_ann.type_ann {
    TsKeywordType(keyword_type) => keyword_type.into(),
    TsLitType(lit_type) => lit_type.into(),
    TsTypeRef(type_ref) => type_ref.into(),
    TsUnionOrIntersectionType(union_or_inter) => union_or_inter.into(),
    TsArrayType(array_type) => array_type.into(),
    TsTupleType(tuple_type) => tuple_type.into(),
    TsTypeOperator(type_op_type) => type_op_type.into(),
    TsParenthesizedType(paren_type) => paren_type.into(),
    TsRestType(rest_type) => rest_type.into(),
    TsOptionalType(optional_type) => optional_type.into(),
    TsTypeQuery(type_query) => type_query.into(),
    TsThisType(this_type) => this_type.into(),
    TsFnOrConstructorType(fn_or_con_type) => fn_or_con_type.into(),
    _ => {
      let repr = source_map
        .span_to_snippet(type_ann.span)
        .expect("Class prop type not found");
      let repr = repr.trim_start_matches(':').trim_start().to_string();

      TsTypeDef {
        repr,
        ..Default::default()
      }
    }
  }
}
