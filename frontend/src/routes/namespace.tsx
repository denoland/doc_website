import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes, NodesProvider } from "../util/nodes";
import { DocNodeKind, DocNodeNamespace } from "../util/docs";
import { RootNamespace } from "../components/RootNamespace";
import { Namespace } from "../components/Namespace";
import { NotFound } from "../components/NotFound";
import { usePrefix, PrefixProvider } from "../util/prefix";
import { ClassRoute } from "./class";
import { FunctionRoute } from "./function";
import { VariableRoute } from "./variable";
import { EnumRoute } from "./enum";
import { InterfaceRoute } from "./interface";
import { TypeAliasRoute } from "./typealias";

export function NamespaceRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();
  const isRootNamespace = prefix.namespace === "" && props.name === "";

  const namespace = (nodes.find(
    (node) => node.kind === DocNodeKind.Namespace && node.name === props.name
  ) as any) as DocNodeNamespace;

  return isRootNamespace || namespace ? (
    <NodesProvider
      value={isRootNamespace ? nodes : namespace.namespaceDef.elements}
    >
      <Switch>
        <Route
          path={`${prefix.namespace}/class/:class`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/class/${params.class}`,
              }}
            >
              <ClassRoute name={params.class} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/function/:function`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/function/${params.function}`,
              }}
            >
              <FunctionRoute name={params.function} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/variable/:variable`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/variable/${params.variable}`,
              }}
            >
              <VariableRoute name={params.variable} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/enum/:enum`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/enum/${params.enum}`,
              }}
            >
              <EnumRoute name={params.enum} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/interface/:interface`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/interface/${params.interface}`,
              }}
            >
              <InterfaceRoute name={params.interface} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/typealias/:typealias`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: prefix.namespace,
                node: `/typealias/${params.typealias}`,
              }}
            >
              <TypeAliasRoute name={params.typealias} />
            </PrefixProvider>
          )}
        />
        <Route
          path={`${prefix.namespace}/namespace/:namespace`}
          render={({ match: { params } }) => (
            <PrefixProvider
              value={{
                namespace: `${prefix.namespace}/namespace/${params.namespace}`,
                node: "",
              }}
            >
              <NamespaceRoute name={params.namespace} />
            </PrefixProvider>
          )}
        />
        <Route
          path={prefix.namespace + "/"}
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
