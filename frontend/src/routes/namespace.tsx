import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes, NodesProvider } from "../util/nodes";
import { DocNodeKind, DocNodeNamespace } from "../util/docs";
import { RootNamespace } from "../components/RootNamespace";
import { Namespace } from "../components/Namespace";
import { NotFound } from "../components/NotFound";
import { usePrefix, PrefixProvider } from "../util/prefix";

export function NamespaceRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();
  const isRootNamespace = prefix === "" && props.name === "";

  const namespace = (nodes.find(
    node => node.kind === DocNodeKind.Namespace && node.name === props.name
  ) as any) as DocNodeNamespace;

  return isRootNamespace || namespace ? (
    <NodesProvider
      value={isRootNamespace ? nodes : namespace.namespaceDef.elements}
    >
      <Switch>
        <Route
          path={`${prefix}/namespace/:namespace`}
          render={({ match: { params } }) => (
            <PrefixProvider value={newPrefix(prefix, params.namespace)}>
              <NamespaceRoute name={params.namespace} />
            </PrefixProvider>
          )}
        />
        <Route
          path={prefix + "/"}
          exact
          render={() =>
            isRootNamespace ? (
              <RootNamespace />
            ) : (
              <Namespace namespace={namespace} />
            )
          }
        />
        <Route render={() => <NotFound />} />
      </Switch>
    </NodesProvider>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find namespace {props.name}.
      </div>
    </div>
  );
}

function newPrefix(prefix: string, name: string): string {
  return prefix + "/namespace/" + name;
}
