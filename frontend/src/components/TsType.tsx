import React from "react";
import { TsTypeDef, findNodeByType, TsTypeDefKind } from "../util/docs";
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
    case TsTypeDefKind.FnOrConstructor:
      return <span>FnOrConstructor</span>;
    case TsTypeDefKind.IndexedAccess:
      return <span>IndexedAccess</span>;
    case TsTypeDefKind.Intersection:
      return <span>Intersection</span>;
    case TsTypeDefKind.Keyword:
      return <span>Keyword</span>;
    case TsTypeDefKind.Literal:
      return <span>{JSON.stringify(tsType.literal)}</span>;
    case TsTypeDefKind.Optional:
      return <span>Optional</span>;
    case TsTypeDefKind.Parenthesized:
      return (
        <span>
          (<TsType tsType={tsType.parenthesized} />)
        </span>
      );
    case TsTypeDefKind.Rest:
      return <span>Rest</span>;
    case TsTypeDefKind.This:
      return <span>This</span>;
    case TsTypeDefKind.Tuple:
      return <span>Tuple</span>;
    case TsTypeDefKind.TypeLiteral:
      return <span>TypeLiteral</span>;
    case TsTypeDefKind.TypeOperator:
      return <span>TypeOperator</span>;
    case TsTypeDefKind.TypeQuery:
      return <span>TypeQuery</span>;
    case TsTypeDefKind.TypeRef:
      const node = findNodeByType(nodes, tsType);
      return node ? (
        <Link href={`#${node.kind}.${node.name}`} className="text-blue-500">
          {tsType.repr}
        </Link>
      ) : (
        <span>{tsType.repr}</span>
      );
    case TsTypeDefKind.Union:
      return <span>Union</span>;
    default:
      return <span>_notimpl_</span>;
  }
};
