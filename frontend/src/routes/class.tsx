import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeClass } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Class } from "../components/Class";

export function ClassRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const class_ = (nodes.find(
    node => node.kind === DocNodeKind.Class && node.name === props.name
  ) as any) as DocNodeClass;

  return class_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <Class class={class_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find class {props.name}.
      </div>
    </div>
  );
}
