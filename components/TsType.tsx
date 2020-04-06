// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React, { memo } from "react";
import {
  TsTypeDef,
  TsTypeDefKind,
  LiteralDefKind,
  findNodeByScopedName,
} from "../util/docs";
import Link from "next/link";
import { useFlattend } from "../util/data";

export const TsType = memo(
  ({ tsType, scope }: { tsType: TsTypeDef; scope: string[] }) => {
    switch (tsType.kind) {
      case TsTypeDefKind.Array:
        return (
          <>
            <TsType tsType={tsType.array} scope={scope} />
            []
          </>
        );
      case TsTypeDefKind.Conditional:
        return (
          <>
            <TsType tsType={tsType.conditionalType.checkType} scope={scope} />{" "}
            extends{" "}
            <TsType tsType={tsType.conditionalType.extendsType} scope={scope} />{" "}
            ? <TsType tsType={tsType.conditionalType.trueType} scope={scope} />{" "}
            : <TsType tsType={tsType.conditionalType.falseType} scope={scope} />
          </>
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
          <>
            {tsType.fnOrConstructor.constructor ? "new " : null} (
            {paramElements}) =>{" "}
            <TsType tsType={tsType.fnOrConstructor.tsType} scope={scope} />
          </>
        );
      }
      case TsTypeDefKind.IndexedAccess:
        return (
          <>
            <TsType tsType={tsType.indexedAccess.objType} scope={scope} />[
            <TsType tsType={tsType.indexedAccess.indexType} scope={scope} />]
          </>
        );
      case TsTypeDefKind.Intersection: {
        const elements: React.ReactNode[] = [];
        tsType.intersection.forEach((tsType) =>
          elements.push(<TsType tsType={tsType} scope={scope} />, " & ")
        );
        elements.pop();
        return <>{elements}</>;
      }
      case TsTypeDefKind.Keyword:
        return <>{tsType.keyword}</>;
      case TsTypeDefKind.Literal:
        switch (tsType.literal.kind) {
          case LiteralDefKind.Number:
            return <>{tsType.literal.number}</>;
          case LiteralDefKind.String:
            return <>"{tsType.literal.string}"</>;
          case LiteralDefKind.Boolean:
            return <>{tsType.literal.boolean ? "true" : "false"}</>;
        }
        return <></>;
      case TsTypeDefKind.Optional:
        return <>_optional_</>;
      case TsTypeDefKind.Parenthesized:
        return (
          <>
            (<TsType tsType={tsType.parenthesized} scope={scope} />)
          </>
        );
      case TsTypeDefKind.Rest:
        return (
          <>
            ...
            <TsType tsType={tsType.rest} scope={scope} />
          </>
        );
      case TsTypeDefKind.This:
        return <>this</>;
      case TsTypeDefKind.Tuple:
        const elements: React.ReactNode[] = [];
        tsType.tuple.forEach((tsType) =>
          elements.push(<TsType tsType={tsType} scope={scope} />, ", ")
        );
        elements.pop();
        return <>[{elements}]</>;
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
            <>
              ({paramElements})
              {callSignature.tsType ? (
                <>
                  :{" "}
                  <TsType tsType={callSignature.tsType} scope={scope}></TsType>
                </>
              ) : null}
            </>,
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
            <>
              {method.name}({paramElements})
              {method.returnType ? (
                <>
                  : <TsType tsType={method.returnType} scope={scope}></TsType>
                </>
              ) : null}
            </>,
            ", "
          );
        });
        tsType.typeLiteral.properties.forEach((property) => {
          final.push(
            <>
              {property.name}
              {property.tsType ? (
                <span className="text-gray-600">
                  : <TsType tsType={property.tsType} scope={scope}></TsType>
                </span>
              ) : null}
            </>,
            ", "
          );
        });
        final.pop();
        return (
          <>
            {"{ "}
            {final}
            {" }"}
          </>
        );
      }
      case TsTypeDefKind.TypeOperator:
        return (
          <>
            {tsType.typeOperator.operator}{" "}
            <TsType tsType={tsType.typeOperator.tsType} scope={scope} />
          </>
        );
      case TsTypeDefKind.TypeQuery: {
        const flattend = useFlattend();
        const node = findNodeByScopedName(
          flattend,
          tsType.typeQuery,
          scope ?? []
        );
        return (
          <>
            typeof{" "}
            {node ? (
              <Link
                href="/https/[...url]"
                as={`#${node.scope ? node.scope.join(".") + "." : ""}${
                  node.name
                }`}
              >
                <a className="link">{tsType.typeQuery}</a>
              </Link>
            ) : (
              tsType.typeQuery
            )}
          </>
        );
      }
      case TsTypeDefKind.TypeRef: {
        const flattend = useFlattend();
        const node = findNodeByScopedName(
          flattend,
          tsType.typeRef.typeName,
          scope ?? [],
          "type"
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
                <a className="link">{tsType.typeRef.typeName}</a>
              </Link>
            ) : (
              tsType.typeRef.typeName
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
        return <>{elements}</>;
      }
      default:
        return <>_notimpl_</>;
    }
  }
);
