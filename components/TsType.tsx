import React from "react";
import {
  TsTypeDef,
  findNodeByType,
  TsTypeDefKind,
  LiteralDefKind,
} from "../util/docs";
import { useData } from "../util/data";
import Link from "next/link";

export const TsType = ({ tsType }: { tsType: TsTypeDef }) => {
  const { nodes } = useData();

  switch (tsType.kind) {
    case TsTypeDefKind.Array:
      return (
        <span>
          <TsType tsType={tsType.array} />
          []
        </span>
      );
    case TsTypeDefKind.Conditional:
      return (
        <span>
          <TsType tsType={tsType.conditionalType.checkType} /> extends{" "}
          <TsType tsType={tsType.conditionalType.extendsType} /> ?{" "}
          <TsType tsType={tsType.conditionalType.trueType} /> :{" "}
          <TsType tsType={tsType.conditionalType.falseType} />
        </span>
      );
    case TsTypeDefKind.FnOrConstructor: {
      const paramElements = [];
      tsType.fnOrConstructor.params.forEach((p) =>
        paramElements.push(
          <>
            {p.name}
            {p.tsType ? (
              <>
                : <TsType tsType={p.tsType} />
              </>
            ) : null}
          </>,
          ", "
        )
      );
      paramElements.pop();
      return (
        <span>
          {tsType.fnOrConstructor.constructor ? "new " : null} ({paramElements}){" "}
          => <TsType tsType={tsType.fnOrConstructor.tsType} />
        </span>
      );
    }
    case TsTypeDefKind.IndexedAccess:
      return (
        <span>
          <TsType tsType={tsType.indexedAccess.objType} />[
          <TsType tsType={tsType.indexedAccess.indexType} />]
        </span>
      );
    case TsTypeDefKind.Intersection: {
      const elements = [];
      tsType.intersection.forEach((tsType) =>
        elements.push(<TsType tsType={tsType} />, " & ")
      );
      elements.pop();
      return <span>{elements}</span>;
    }
    case TsTypeDefKind.Keyword:
      return <span>{tsType.keyword}</span>;
    case TsTypeDefKind.Literal:
      switch (tsType.literal.kind) {
        case LiteralDefKind.Number:
          return <span>{tsType.literal.number}</span>;
        case LiteralDefKind.String:
          return <span>"{tsType.literal.string}"</span>;
        case LiteralDefKind.Boolean:
          return <span>{tsType.literal.boolean ? "true" : "false"}</span>;
      }
      return <></>;
    case TsTypeDefKind.Optional:
      return <span>_optional_</span>;
    case TsTypeDefKind.Parenthesized:
      return (
        <span>
          (<TsType tsType={tsType.parenthesized} />)
        </span>
      );
    case TsTypeDefKind.Rest:
      return (
        <span>
          ...
          <TsType tsType={tsType.rest} />
        </span>
      );
    case TsTypeDefKind.This:
      return <span>this</span>;
    case TsTypeDefKind.Tuple:
      const elements = [];
      tsType.tuple.forEach((tsType) =>
        elements.push(<TsType tsType={tsType} />, ", ")
      );
      elements.pop();
      return <span>[{elements}]</span>;
    case TsTypeDefKind.TypeLiteral: {
      const final = [];
      tsType.typeLiteral.callSignatures.forEach((callSignature) => {
        const paramElements = [];
        (callSignature.params ?? []).forEach((p) =>
          paramElements.push(
            <>
              {p.name}
              {p.tsType ? (
                <>
                  : <TsType tsType={p.tsType} />
                </>
              ) : null}
            </>,
            ", "
          )
        );
        paramElements.pop();
        final.push(
          <span>
            ({paramElements})
            {callSignature.tsType ? (
              <>
                : <TsType tsType={callSignature.tsType}></TsType>
              </>
            ) : null}
          </span>,
          ", "
        );
      });
      tsType.typeLiteral.methods.forEach((method) => {
        const paramElements = [];
        (method.params ?? []).forEach((p) => [
          <>
            {p.name}
            {p.tsType ? (
              <>
                : <TsType tsType={p.tsType} />
              </>
            ) : null}
          </>,
          ", ",
        ]);
        paramElements.pop();
        final.push(
          <span>
            {method.name}({paramElements})
            {method.returnType ? (
              <>
                : <TsType tsType={method.returnType}></TsType>
              </>
            ) : null}
          </span>,
          ", "
        );
      });
      tsType.typeLiteral.properties.forEach((property) => {
        final.push(
          <span>
            {property.name}
            {property.tsType ? (
              <span className="text-gray-600">
                : <TsType tsType={property.tsType}></TsType>
              </span>
            ) : null}
          </span>,
          ", "
        );
      });
      final.pop();
      return (
        <span>
          {"{ "}
          {final}
          {" }"}
        </span>
      );
    }
    case TsTypeDefKind.TypeOperator:
      return (
        <span>
          {tsType.typeOperator.operator}{" "}
          <TsType tsType={tsType.typeOperator.tsType} />
        </span>
      );
    case TsTypeDefKind.TypeQuery:
      return <span>typeof {tsType.typeQuery}</span>;
    case TsTypeDefKind.TypeRef:
      const node = findNodeByType(nodes, tsType);
      const paramElements = [];
      (tsType.typeRef.typeParams ?? []).forEach((tsType) =>
        paramElements.push(<TsType tsType={tsType} />, ", ")
      );
      paramElements.pop();
      return (
        <>
          {node ? (
            <Link href="/https/[...url]" as={`#${node.name}`}>
              <a className="text-blue-600">{tsType.typeRef.typeName}</a>
            </Link>
          ) : (
            <span>{tsType.typeRef.typeName}</span>
          )}
          {tsType.typeRef.typeParams ? (
            <>
              {"<"}
              {paramElements}
              {">"}
            </>
          ) : null}
        </>
      );
    case TsTypeDefKind.Union: {
      const elements = [];
      tsType.union.forEach((tsType, i) =>
        elements.push(<TsType tsType={tsType} key={i} />, " | ")
      );
      elements.pop();
      return <span>{elements}</span>;
    }
    default:
      return <span>_notimpl_</span>;
  }
};
