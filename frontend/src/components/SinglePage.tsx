import React from "react";
import { useNodes } from "../util/nodes";
import { groupNodes, DocNode } from "../util/docs";
import { Page } from "./Page";
import { JSDoc, CodeBlock } from "./JSDoc";

export function SinglePage() {
  const nodes = useNodes();
  const groups = groupNodes(nodes);

  return (
    <Page mode="singlepage">
      <div className="bg-gray-100 py-3 px-6 h-full">
        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <div>
              {groups.classes.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
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
              {groups.variables.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
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
              {groups.functions.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
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
              {groups.interfaces.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
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
              {groups.typeAliases.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
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
              {groups.namespaces.map((node, i) => (
                <DocNodeCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
}

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

      <CodeBlock value={node.snippet} />

      <div className="text-sm mt-2 text-gray-600">
        Defined in file '{node.location.filename}' on line {node.location.line},
        column {node.location.col}.
      </div>

      {node.jsDoc ? (
        <div className="mt-2">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}
    </div>
  );
}
