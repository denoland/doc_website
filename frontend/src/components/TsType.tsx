import React from "react";
import {
  TsTypeDef,
  findNodeByType,
  TsTypeDefKind,
  LiteralDefKind
} from "../util/docs";
import { useNodes } from "../util/nodes";
import { Link } from "./Link";

export const TsType = ({ tsType }: { tsType: TsTypeDef }) => {
  const nodes = useNodes();

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
      const paramElements = (tsType.fnOrConstructor.params ?? []).flatMap(p => [
        <>
          {p.name}
          {p.tsType ? (
            <>
              : <TsType tsType={p.tsType} />
            </>
          ) : null}
        </>,
        ", "
      ]);
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
      const elements = tsType.intersection.flatMap(tsType => [
        <TsType tsType={tsType} />,
        " & "
      ]);
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
      const elements = tsType.tuple.flatMap(tsType => [
        <TsType tsType={tsType} />,
        ", "
      ]);
      elements.pop();
      return <span>[{elements}]</span>;
    case TsTypeDefKind.TypeLiteral: {
      const callSignatures = tsType.typeLiteral.callSignatures.flatMap(
        callSignature => {
          const paramElements = (callSignature.params ?? []).flatMap(p => [
            <>
              {p.name}
              {p.tsType ? (
                <>
                  : <TsType tsType={p.tsType} />
                </>
              ) : null}
            </>,
            ", "
          ]);
          paramElements.pop();
          return [
            <span>
              ({paramElements})
              {callSignature.tsType ? (
                <>
                  : <TsType tsType={callSignature.tsType}></TsType>
                </>
              ) : null}
            </span>,
            ", "
          ];
        }
      );
      const methods = tsType.typeLiteral.methods.flatMap(method => {
        const paramElements = (method.params ?? []).flatMap(p => [
          <>
            {p.name}
            {p.tsType ? (
              <>
                : <TsType tsType={p.tsType} />
              </>
            ) : null}
          </>,
          ", "
        ]);
        paramElements.pop();
        return [
          <span>
            {method.name}({paramElements})
            {method.returnType ? (
              <>
                : <TsType tsType={method.returnType}></TsType>
              </>
            ) : null}
          </span>,
          ", "
        ];
      });
      const properties = tsType.typeLiteral.properties.flatMap(property => {
        return [
          <span>
            {property.name}
            {property.tsType ? (
              <span className="text-gray-600">
                : <TsType tsType={property.tsType}></TsType>
              </span>
            ) : null}
          </span>,
          ", "
        ];
      });

      const final = [...callSignatures, ...methods, ...properties];
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
      const paramElements = (
        tsType.typeRef.typeParams ?? []
      ).flatMap(tsType => [<TsType tsType={tsType} />, ", "]);
      paramElements.pop();
      return (
        <>
          {node ? (
            <Link href={`#${node.kind}.${node.name}`} className="text-blue-500">
              {tsType.typeRef.typeName}
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
      const elements = tsType.union.flatMap(tsType => [
        <TsType tsType={tsType} />,
        " | "
      ]);
      elements.pop();
      return <span>{elements}</span>;
    }
    default:
      return <span>_notimpl_</span>;
  }
};
