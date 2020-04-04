import React from "react";
import { DocNodeFunction } from "../util/docs";
import { SimpleCard } from "./SinglePage";

export function FunctionCard({
  node,
  nested,
}: {
  node: DocNodeFunction;
  nested: boolean;
}) {
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="function"
      params={node.functionDef?.params}
      returnType={node.functionDef.returnType}
    />
  );
}
