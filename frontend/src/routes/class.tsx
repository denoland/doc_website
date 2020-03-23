import React from "react";
import { Switch, Route } from "react-router-dom";
import { useNodes } from "../util/nodes";
import {
  DocNodeKind,
  DocNodeClass,
  ClassConstructorDef,
  ClassPropertyDef,
  ClassMethodDef
} from "../util/docs";
import { NotFound } from "../components/NotFound";
import { usePrefix, PrefixProvider } from "../util/prefix";
import {
  Class,
  ClassConstructor,
  ClassProperty,
  ClassMethod
} from "../components/Class";

export function ClassRoute(props: { name: string }) {
  const prefix = usePrefix();
  const nodes = useNodes();

  const class_ = (nodes.find(
    node => node.kind === DocNodeKind.Class && node.name === props.name
  ) as any) as DocNodeClass;

  return class_ ? (
    <Switch>
      <Route
        path={`${prefix.namespace + prefix.node}/constructor/:constructor`}
        render={({ match: { params } }) => (
          <PrefixProvider
            value={{
              namespace: prefix.namespace,
              node: `${prefix.node}/constructor/${params.constructor}`
            }}
          >
            <ClassConstructorRoute name={params.constructor} class={class_} />
          </PrefixProvider>
        )}
      />
      <Route
        path={`${prefix.namespace + prefix.node}/property/:property`}
        render={({ match: { params } }) => (
          <PrefixProvider
            value={{
              namespace: prefix.namespace,
              node: `${prefix.node}/property/${params.property}`
            }}
          >
            <ClassPropertyRoute name={params.property} class={class_} />
          </PrefixProvider>
        )}
      />
      <Route
        path={`${prefix.namespace + prefix.node}/method/:method`}
        render={({ match: { params } }) => (
          <PrefixProvider
            value={{
              namespace: prefix.namespace,
              node: `${prefix.node}/method/${params.method}`
            }}
          >
            <ClassMethodRoute name={params.method} class={class_} />
          </PrefixProvider>
        )}
      />
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

export function ClassConstructorRoute(props: {
  name: string;
  class: DocNodeClass;
}) {
  const prefix = usePrefix();

  const constructor_ = (props.class.classDef.constructors.find(
    node => node.name === props.name
  ) as any) as ClassConstructorDef;

  return constructor_ ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <ClassConstructor constructor_={constructor_} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find class constructor {props.name}.
      </div>
    </div>
  );
}

export function ClassPropertyRoute(props: {
  name: string;
  class: DocNodeClass;
}) {
  const prefix = usePrefix();

  const property = (props.class.classDef.properties.find(
    node => node.name === props.name
  ) as any) as ClassPropertyDef;

  return property ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <ClassProperty property={property} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find class property {props.name}.
      </div>
    </div>
  );
}

export function ClassMethodRoute(props: { name: string; class: DocNodeClass }) {
  const prefix = usePrefix();

  const method = (props.class.classDef.methods.find(
    node => node.name === props.name
  ) as any) as ClassMethodDef;

  return method ? (
    <Switch>
      <Route
        path={prefix.namespace + prefix.node}
        exact
        render={() => <ClassMethod method={method} />}
      />
      <Route render={() => <NotFound />} />
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">
        Could not find class method {props.name}.
      </div>
    </div>
  );
}
