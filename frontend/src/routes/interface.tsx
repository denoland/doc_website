import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeInterface } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Interface } from "../components/Interface";

export function InterfaceRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const interface_ = (nodes.find(
    (node) => node.kind === DocNodeKind.Interface && node.name === props.name
  ) as any) as DocNodeInterface;

  return interface_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <Interface interface={interface_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find interface {props.name}.
      </div>
    </div>
  );
}
