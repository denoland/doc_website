import React from "react";
import { DocNodeFunction } from "../util/docs";
import { SimpleCard } from "./SinglePage";

export function FunctionCard({ node }: { node: DocNodeFunction }) {
  return (
    <SimpleCard
      node={node}
      prefix="function"
      params={node.functionDef?.params}
      returnType={node.functionDef.returnType}
    />
  );
}
