import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeEnum } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Enum } from "../components/Enum";

export function EnumRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const enum_ = (nodes.find(
    (node) => node.kind === DocNodeKind.Enum && node.name === props.name
  ) as any) as DocNodeEnum;

  return enum_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <Enum enum={enum_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find enum {props.name}.
      </div>
    </div>
  );
}
