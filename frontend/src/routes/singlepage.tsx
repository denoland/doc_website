import React from "react";
import {
  DocNode,
  DocNodeLocation,
  ParamDef,
  TsTypeDef,
  groupNodes,
  cleanJSDoc,
  DocNodeNamespace,
} from "../util/docs";
import { Page } from "../components/Page";

function DocNodeCard(props: { node: DocNode }) {
  const { node } = props;

  return (
    <div className="shadow rounded my-3 bg-white p-2">
      <div className="text-lg font-bold mb-2">
        {node.kind ? <span className="text-gray-600">{node.kind} </span> : null}
        <span className="font">{node.name}</span>
      </div>
      
      <pre className="text-sm font-mono">{node.snippet}</pre>
      
      <div className="text-sm mt-2 text-gray-600">
        Defined in file '{node.location.filename}' on line {node.location.line},
        column {node.location.col}.
      </div>

      {node.jsDoc ? (
        <pre className="text-sm text-gray-700 mt-2">{node.jsDoc}</pre>
      ) : null}
    </div>
  );
}

export function SinglePageRoute(props: { nodes: DocNode[] }) {
  const ns = props.nodes[0] as DocNodeNamespace;
  const elemens = ns.namespaceDef.elements;
  const groups = groupNodes(elemens);

  return (
    <Page>
      <div className="bg-gray-100 py-3 px-6 h-full">
        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <ul>
              {groups.classes.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.variables.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Variables
            </div>
            <ul>
              {groups.variables.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.functions.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Functions
            </div>
            <ul>
              {groups.functions.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <ul>
              {groups.enums.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.interfaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Interfaces
            </div>
            <ul>
              {groups.interfaces.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.typeAliases.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Type Aliases
            </div>
            <ul>
              {groups.typeAliases.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.namespaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Namespaces
            </div>
            <ul>
              {groups.namespaces.map((node) => (
                <li>{node.name}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <div>
              {groups.classes.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.variables.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Variables
            </div>
            <div>
              {groups.variables.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.functions.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Functions
            </div>
            <div>
              {groups.functions.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.interfaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Interfaces
            </div>
            <div>
              {groups.interfaces.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.typeAliases.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Type Aliases
            </div>
            <div>
              {groups.typeAliases.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.namespaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Namespaces
            </div>
            <div>
              {groups.namespaces.map((node) => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
}

interface SimpleDocNode {
  name: string;
  snippet: string;
  location: DocNodeLocation;
  jsDoc?: string;
  params?: ParamDef[];
  returnType?: TsTypeDef;
  prefix: string;
}

function unfirl(nodes: DocNode[]): SimpleDocNode[] {
  const simpleNodes: SimpleDocNode[] = [];

  const grouped = groupNodes(nodes);

  grouped.functions.forEach((function_) => {
    simpleNodes.push({
      name: function_.name,
      location: function_.location,
      snippet: function_.snippet,
      jsDoc: function_.jsDoc,
      params: function_.functionDef?.params,
      returnType: function_.functionDef?.returnType,
      prefix: "",
    });
  });

  grouped.variables.forEach((variable) => {
    simpleNodes.push({
      name: `${variable.name}`,
      // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
      location: variable.location,
      snippet: variable.snippet,
      jsDoc: variable.jsDoc,
      // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
      returnType: variable.variableDef?.type_,
      prefix: variable.variableDef?.kind,
    });
  });

  grouped.classes.forEach((class_) => {
    simpleNodes.push({
      name: class_.name,
      location: class_.location,
      snippet: class_.snippet,
      jsDoc: class_.jsDoc,
      prefix: "class",
    });

    class_.classDef.constructors.forEach((constructor_) => {
      const name =
        constructor_.name === "constructor"
          ? class_.name
          : `${class_.name}.${constructor_.name}`;

      simpleNodes.push({
        name,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
        location: class_.location,
        snippet: constructor_.snippet,
        jsDoc: constructor_.jsDoc,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
        params: [],
        prefix: "new",
      });
    });

    class_.classDef.methods.forEach((method) => {
      simpleNodes.push({
        name: `${class_.name}.${method.name}`,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
        location: class_.location,
        snippet: method.snippet,
        jsDoc: method.jsDoc,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
        params: [],
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
        returnType: undefined,
        prefix: "",
      });
    });

    class_.classDef.properties.forEach((property) => {
      simpleNodes.push({
        name: `${class_.name}.${property.name}`,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
        location: class_.location,
        snippet: property.snippet,
        jsDoc: property.jsDoc,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
        returnType: property.tsType,
        prefix: "",
      });
    });
  });

  grouped.enums.forEach((enums) => {
    enums.enumDef.members.forEach((val) => {
      simpleNodes.push({
        name: `${enums.name}.${val.name}`,
        location: enums.location,
        snippet: enums.snippet,
        jsDoc: enums.jsDoc,
        prefix: "",
      });
    });
  });

  grouped.interfaces.forEach((interface_) => {
    simpleNodes.push({
      name: interface_.name,
      location: interface_.location,
      snippet: interface_.snippet,
      jsDoc: interface_.jsDoc,
      prefix: "interface",
    });
  });

  grouped.typeAliases.forEach((typeAlias) => {
    simpleNodes.push({
      name: typeAlias.name,
      location: typeAlias.location,
      snippet: typeAlias.snippet,
      jsDoc: typeAlias.jsDoc,
      prefix: "type",
    });
  });

  grouped.namespaces.forEach((ns) => {
    ns.namespaceDef.elements.forEach((el) => {
      simpleNodes.push({
        name: el.name,
        location: el.location,
        snippet: el.snippet,
        jsDoc: el.jsDoc,
        prefix: el.kind,
      });
    });
  });

  return simpleNodes;
}
