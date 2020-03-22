import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import { DocNodeKind, DocNodeTypeAlias } from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix } from "../util/prefix";
import { Interface } from "../components/Interface";
import { TypeAlias } from "../components/TypeAlias";

export function TypeAliasRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const typealias_ = (nodes.find(
    (node) => node.kind === DocNodeKind.TypeAlias && node.name === props.name
  ) as any) as DocNodeTypeAlias;

  return typealias_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <TypeAlias typealias={typealias_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find typealias {props.name}.
      </div>
    </div>
  );
}
