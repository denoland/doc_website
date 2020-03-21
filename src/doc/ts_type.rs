use serde::Serialize;
use swc_common::SourceMap;
use swc_ecma_ast;
use swc_ecma_ast::TsTypeAnn;

// pub enum TsType {
//     TsKeywordType(TsKeywordType),
//     TsThisType(TsThisType),
//     TsFnOrConstructorType(TsFnOrConstructorType),
//     TsTypeRef(TsTypeRef),
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
//     TsLitType(TsLitType),
//     TsTypePredicate(TsTypePredicate),
//     TsImportType(TsImportType),
// }

#[derive(Debug, Serialize)]
pub struct TsTypeDef {
  pub repr: String,
  // TODO: make this struct more conrete
}

pub fn ts_type_ann_to_def(
  source_map: &SourceMap,
  type_ann: &TsTypeAnn,
) -> TsTypeDef {
  let repr = source_map
    .span_to_snippet(type_ann.span)
    .expect("Class prop type not found");
  let repr = repr.trim_start_matches(':').trim_start().to_string();

  TsTypeDef { repr }
}
