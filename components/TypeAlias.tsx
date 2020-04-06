// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeTypeAlias } from "../util/docs";
import { SimpleCard } from "./SinglePage";

export function TypeAliasCard({
  node,
  nested,
}: {
  node: DocNodeTypeAlias;
  nested: boolean;
}) {
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="type"
      returnType={node.typeAliasDef?.tsType}
    />
  );
}
