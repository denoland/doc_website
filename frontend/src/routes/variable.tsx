import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeVariable } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Variable } from "../components/Variable";

export function VariableRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const variable = (nodes.find(
    (node) => node.kind === DocNodeKind.Variable && node.name === props.name
  ) as any) as DocNodeVariable;

  return variable ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <Variable variable={variable} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find variable {props.name}.
      </div>
    </div>
  );
}
