use serde::Serialize;
use swc_common::SourceMap;
use swc_ecma_ast;
use swc_ecma_ast::TsKeywordType;
use swc_ecma_ast::TsLit;
use swc_ecma_ast::TsLitType;
use swc_ecma_ast::TsType;
use swc_ecma_ast::TsTypeAnn;
use swc_ecma_ast::TsTypeRef;
use swc_ecma_ast::TsUnionOrIntersectionType;

// pub enum TsType {
//  *      TsKeywordType(TsKeywordType),
//     TsThisType(TsThisType),
//     TsFnOrConstructorType(TsFnOrConstructorType),
//  *      TsTypeRef(TsTypeRef),
//     TsTypeQuery(TsTypeQuery),
//     TsTypeLit(TsTypeLit),
//     TsArrayType(TsArrayType),
//     TsTupleType(TsTupleType),
//     TsOptionalType(TsOptionalType),
//     TsRestType(TsRestType),
//     TsUnionOrIntersectionType(TsUnionOrIntersectionType),
//     TsConditionalType(TsConditionalType),
//     TsInferType(TsInferType),
//     TsParenthesizedType(TsParenthesizedType),
//     TsTypeOperator(TsTypeOperator),
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

impl Into<TsTypeDef> for &TsType {
  fn into(self) -> TsTypeDef {
    use swc_ecma_ast::TsType::*;

    match self {
      TsKeywordType(ref keyword_type) => keyword_type.into(),
      TsLitType(ref lit_type) => lit_type.into(),
      TsTypeRef(ref type_ref) => type_ref.into(),
      TsUnionOrIntersectionType(union_or_inter) => union_or_inter.into(),
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
  //   #[serde(skip_serializing_if = "Option::is_none")]
  //   pub type_alias_def: Option<TypeAliasDef>,

  //   #[serde(skip_serializing_if = "Option::is_none")]
  //   pub namespace_def: Option<NamespaceDef>,

  //   #[serde(skip_serializing_if = "Option::is_none")]
  //   pub interface_def: Option<InterfaceDef>,
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
