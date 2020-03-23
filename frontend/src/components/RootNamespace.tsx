import React from "react";
import { useNodes } from "../util/nodes";
import { Namespace } from "./Namespace";
import { DocNodeKind } from "../util/docs";

export function RootNamespace() {
  const nodes = useNodes();
  return (
    <Namespace
      namespace={{
        kind: DocNodeKind.Namespace,
        name: "Root ",
        snippet: "",
        location: {
          filename: "",
          col: 0,
          line: 0,
        },
        namespaceDef: {
          elements: nodes,
        },
      }}
      isRootNamespace
    />
  );
}
