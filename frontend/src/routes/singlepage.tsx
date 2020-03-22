import React from "react";
import {
  DocNode,
  DocNodeLocation,
  ParamDef,
  TsTypeDef,
  groupNodes,
  cleanJSDoc
} from "../util/docs";

export function SinglePageRoute(props: { nodes: DocNode[] }) {
  const simpleNodes = unfirl(props.nodes);

  return (
    <div className="bg-gray-100 py-3 px-6 h-full">
      {simpleNodes.map(node => {
        return (
          <div className="shadow rounded my-3 bg-white p-2">
            <div className="text-lg font-bold">
              {node.prefix ? (
                <span className="text-gray-600">{node.prefix} </span>
              ) : null}
              <span className="font">{node.name}</span>
              {node.params ? (
                <span className="text-gray-600">
                  (
                  {node.params
                    .map(
                      p => `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`
                    )
                    .join(", ")}
                  )
                </span>
              ) : null}
            </div>
            <div className="font-mono">{node.snippet}</div>
            {node.jsDoc ? (
              <p className="text-gray-700 mt-2">{cleanJSDoc(node.jsDoc)}</p>
            ) : null}
            {node.params && node.params.length > 0 ? (
              <div className="mt-2">
                <p className="font-bold">Parameters</p>
                <ul>
                  {node.params.map(param => (
                    <li className="font-mono">
                      {param.name}
                      {param.tsType?.repr ? ": " + param.tsType.repr : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {node.returnType ? (
              <div className="mt-2">
                <span className="font-bold">Returns: </span>
                <span className="font-mono">{node.returnType.repr}</span>
              </div>
            ) : null}

            <div className="text-sm mt-2">
              Defined in file '{node.location.filename}' on line{" "}
              {node.location.line}, column {node.location.col}.
            </div>
          </div>
        );
      })}
    </div>
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

  grouped.functions.forEach(function_ => {
    simpleNodes.push({
      name: function_.name,
      location: function_.location,
      snippet: function_.snippet,
      jsDoc: function_.jsDoc,
      params: function_.functionDef?.params,
      returnType: function_.functionDef?.returnType,
      prefix: ""
    });
  });

  grouped.variables.forEach(variable => {
    simpleNodes.push({
      name: `${variable.name}`,
      // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
      location: variable.location,
      snippet: variable.snippet,
      jsDoc: variable.jsDoc,
      // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
      returnType: variable.variableDef?.type_,
      prefix: variable.variableDef?.kind
    });
  });

  grouped.classes.forEach(class_ => {
    simpleNodes.push({
      name: class_.name,
      location: class_.location,
      snippet: class_.snippet,
      jsDoc: class_.jsDoc,
      prefix: "class"
    });

    class_.classDef.constructors.forEach(constructor_ => {
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
        prefix: "new"
      });
    });

    class_.classDef.methods.forEach(method => {
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
        prefix: ""
      });
    });

    class_.classDef.properties.forEach(property => {
      simpleNodes.push({
        name: `${class_.name}.${property.name}`,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/6
        location: class_.location,
        snippet: property.snippet,
        jsDoc: property.jsDoc,
        // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
        returnType: property.tsType,
        prefix: ""
      });
    });
  });

  grouped.enums.forEach(enums => {
    enums.enumDef.members.forEach(val => {
      simpleNodes.push({
        name: `${enums.name}.${val.name}`,
        location: enums.location,
        snippet: enums.snippet,
        jsDoc: enums.jsDoc,
        prefix: ""
      });
    });
  });

  grouped.interfaces.forEach(interface_ => {
    simpleNodes.push({
      name: interface_.name,
      location: interface_.location,
      snippet: interface_.snippet,
      jsDoc: interface_.jsDoc,
      prefix: "interface"
    });
  });

  grouped.typeAliases.forEach(typeAlias => {
    simpleNodes.push({
      name: typeAlias.name,
      location: typeAlias.location,
      snippet: typeAlias.snippet,
      jsDoc: typeAlias.jsDoc,
      prefix: "type"
    });
  });

  return simpleNodes;
}
