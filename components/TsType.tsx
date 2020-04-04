import React from "react";
import {
  TsTypeDef,
  TsTypeDefKind,
  LiteralDefKind,
  findNodeByScopedName,
} from "../util/docs";
import { useData } from "../util/data";
import Link from "next/link";

export const TsType = ({
  tsType,
  scope,
}: {
  tsType: TsTypeDef;
  scope: string[];
}) => {
  const { nodes } = useData();

  switch (tsType.kind) {
    case TsTypeDefKind.Array:
      return (
        <span>
          <TsType tsType={tsType.array} scope={scope} />
          []
        </span>
      );
    case TsTypeDefKind.Conditional:
      return (
        <span>
          <TsType tsType={tsType.conditionalType.checkType} scope={scope} />{" "}
          extends{" "}
          <TsType tsType={tsType.conditionalType.extendsType} scope={scope} /> ?{" "}
          <TsType tsType={tsType.conditionalType.trueType} scope={scope} /> :{" "}
          <TsType tsType={tsType.conditionalType.falseType} scope={scope} />
        </span>
      );
    case TsTypeDefKind.FnOrConstructor: {
      const paramElements: React.ReactNode[] = [];
      tsType.fnOrConstructor.params.forEach((p) =>
        paramElements.push(
          <>
            {p.name}
            {p.tsType ? (
              <>
                : <TsType tsType={p.tsType} scope={scope} />
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
          => <TsType tsType={tsType.fnOrConstructor.tsType} scope={scope} />
        </span>
      );
    }
    case TsTypeDefKind.IndexedAccess:
      return (
        <span>
          <TsType tsType={tsType.indexedAccess.objType} scope={scope} />[
          <TsType tsType={tsType.indexedAccess.indexType} scope={scope} />]
        </span>
      );
    case TsTypeDefKind.Intersection: {
      const elements: React.ReactNode[] = [];
      tsType.intersection.forEach((tsType) =>
        elements.push(<TsType tsType={tsType} scope={scope} />, " & ")
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
          (<TsType tsType={tsType.parenthesized} scope={scope} />)
        </span>
      );
    case TsTypeDefKind.Rest:
      return (
        <span>
          ...
          <TsType tsType={tsType.rest} scope={scope} />
        </span>
      );
    case TsTypeDefKind.This:
      return <span>this</span>;
    case TsTypeDefKind.Tuple:
      const elements: React.ReactNode[] = [];
      tsType.tuple.forEach((tsType) =>
        elements.push(<TsType tsType={tsType} scope={scope} />, ", ")
      );
      elements.pop();
      return <span>[{elements}]</span>;
    case TsTypeDefKind.TypeLiteral: {
      const final: React.ReactNode[] = [];
      tsType.typeLiteral.callSignatures.forEach((callSignature) => {
        const paramElements: React.ReactNode[] = [];
        (callSignature.params ?? []).forEach((p) =>
          paramElements.push(
            <>
              {p.name}
              {p.tsType ? (
                <>
                  : <TsType tsType={p.tsType} scope={scope} />
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
                : <TsType tsType={callSignature.tsType} scope={scope}></TsType>
              </>
            ) : null}
          </span>,
          ", "
        );
      });
      tsType.typeLiteral.methods.forEach((method) => {
        const paramElements: React.ReactNode[] = [];
        (method.params ?? []).forEach((p) => [
          <>
            {p.name}
            {p.tsType ? (
              <>
                : <TsType tsType={p.tsType} scope={scope} />
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
                : <TsType tsType={method.returnType} scope={scope}></TsType>
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
                : <TsType tsType={property.tsType} scope={scope}></TsType>
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
          <TsType tsType={tsType.typeOperator.tsType} scope={scope} />
        </span>
      );
    case TsTypeDefKind.TypeQuery:
      const node = findNodeByScopedName(
        nodes,
        tsType.typeQuery,
        scope ?? [],
        false
      );
      return (
        <span>
          typeof
          {node ? (
            <Link
              href="/https/[...url]"
              as={`#${node.scope ? node.scope.join(".") + "." : ""}${
                node.name
              }`}
            >
              <a className="text-blue-600">{tsType.typeQuery}</a>
            </Link>
          ) : (
            <span>{tsType.typeQuery}</span>
          )}
        </span>
      );
    case TsTypeDefKind.TypeRef: {
      const node = findNodeByScopedName(
        nodes,
        tsType.typeRef.typeName,
        scope ?? [],
        true
      );
      const paramElements: React.ReactNode[] = [];
      (tsType.typeRef.typeParams ?? []).forEach((tsType) =>
        paramElements.push(<TsType tsType={tsType} scope={scope} />, ", ")
      );
      paramElements.pop();
      return (
        <>
          {node ? (
            <Link
              href="/https/[...url]"
              as={`#${node.scope ? node.scope.join(".") + "." : ""}${
                node.name
              }`}
            >
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
    }
    case TsTypeDefKind.Union: {
      const elements: React.ReactNode[] = [];
      tsType.union.forEach((tsType, i) =>
        elements.push(<TsType tsType={tsType} key={i} scope={scope} />, " | ")
      );
      elements.pop();
      return <span>{elements}</span>;
    }
    default:
      return <span>_notimpl_</span>;
  }
};
