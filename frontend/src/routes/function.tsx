import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeFunction } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Function } from "../components/Function";

export function FunctionRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const function_ = (nodes.find(
    node => node.kind === DocNodeKind.Function && node.name === props.name
  ) as any) as DocNodeFunction;

  return function_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <Function function={function_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find function {props.name}.
      </div>
    </div>
  );
}
