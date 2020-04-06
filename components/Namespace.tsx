// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeNamespace } from "../util/docs";
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
      details={<CardList nodes={node.namespaceDef.elements} nested />}
    />
  );
}
