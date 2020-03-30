import React from "react";
import { DocNode } from "../util/docs";
import { NodesProvider } from "../util/nodes";
import { SinglePage } from "../components/SinglePage";

export function SinglePageRoute(props: { nodes: DocNode[] }) {
  return (
    <NodesProvider value={props.nodes}>
      <SinglePage />
    </NodesProvider>
  );
}
