import React from "react";
import { DocNode, groupNodes, DocNodeNamespace } from "../util/docs";
import { Page } from "../components/Page";
import { JSDoc } from "../components/JSDoc";

function DocNodeCard(props: { node: DocNode }) {
  const { node } = props;

  return (
    <div
      className="shadow rounded my-3 bg-white p-2"
      id={`${node.kind}.${node.name}`}
    >
      <div className="text-lg font-bold mb-2">
        {node.kind ? <span className="text-gray-600">{node.kind} </span> : null}
        <span className="font">{node.name}</span>
      </div>

      <pre className="text-sm font-mono">{node.snippet}</pre>

      <div className="text-sm mt-2 text-gray-600">
        Defined in file '{node.location.filename}' on line {node.location.line},
        column {node.location.col}.
      </div>

      {node.jsDoc ? <JSDoc jsdoc={node.jsDoc} /> : null}
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
              {groups.classes.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.variables.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.functions.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <ul>
              {groups.enums.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.interfaces.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.typeAliases.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.namespaces.map(node => (
                <li>
                  <a href={`#${node.kind}.${node.name}`}>{node.name}</a>
                </li>
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
              {groups.classes.map(node => (
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
              {groups.variables.map(node => (
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
              {groups.functions.map(node => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map(node => (
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
              {groups.interfaces.map(node => (
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
              {groups.typeAliases.map(node => (
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
              {groups.namespaces.map(node => (
                <DocNodeCard node={node} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
}
