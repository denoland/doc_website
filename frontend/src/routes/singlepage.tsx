import React from "react";
import { DocNode, DocNodeNamespace } from "../util/docs";
import { NodesProvider } from "../util/nodes";
import { SinglePage } from "../components/SinglePage";

export function SinglePageRoute(props: { nodes: DocNode[] }) {
  const ns = props.nodes[0] as DocNodeNamespace;
  const elements = ns.namespaceDef.elements;

  return (
    <NodesProvider value={elements}>
      <SinglePage />
    </NodesProvider>
  );
}
