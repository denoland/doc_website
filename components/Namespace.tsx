// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeNamespace, groupNodes, sortByAlphabet } from "../util/docs";
import { SimpleCard, CardList } from "./SinglePage";

export function NamespaceCard({
  node,
  nested,
}: {
  node: DocNodeNamespace;
  nested: boolean;
}) {
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="namespace"
      details={
        <CardList
          groups={groupNodes(sortByAlphabet(node.namespaceDef.elements))}
          nested
        />
      }
    />
  );
}
