import React from "react";
import { DocNodeTypeAlias } from "../util/docs";
import { SimpleCard } from "./SinglePage";

export function TypeAliasCard({ node }: { node: DocNodeTypeAlias }) {
  return (
    <SimpleCard
      node={node}
      prefix="type"
      returnType={node.typeAliasDef?.tsType}
    />
  );
}
