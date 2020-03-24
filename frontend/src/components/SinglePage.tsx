import React from "react";
import { useNodes } from "../util/nodes";
import {
  groupNodes,
  DocNodeShared,
  ParamDef,
  TsTypeDef,
  DocNodeLocation,
  sortByAlphabet
} from "../util/docs";
import { Page } from "./Page";
import { JSDoc, CodeBlock } from "./JSDoc";
import { ClassCard } from "./Class";
import { TsType } from "./TsType";
import { FunctionCard } from "./Function";
import { EnumCard } from "./Enum";
import { InterfaceCard } from "./Interface";
import { VariableCard } from "./Variable";
import { TypeAliasCard } from "./TypeAlias";

export function SinglePage() {
  const nodes = useNodes();
  const sorted = sortByAlphabet(nodes);
  const groups = groupNodes(sorted);

  return (
    <Page mode="singlepage">
      <div className="bg-gray-100 py-3 px-6 h-full max-w-4xl">
        {groups.functions.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Functions
            </div>
            <div>
              {groups.functions.map((node, i) => (
                <FunctionCard
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
                <VariableCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <div>
              {groups.classes.map((node, i) => (
                <ClassCard node={node} key={`${node.kind}.${node.name}+${i}`} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map((node, i) => (
                <EnumCard node={node} key={`${node.kind}.${node.name}+${i}`} />
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
                <InterfaceCard
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
                <TypeAliasCard
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
                <SimpleCard
                  node={node}
                  key={`${node.kind}.${node.name}+${i}`}
                  showSnippet
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
}

export function SimpleCard({
  node,
  prefix,
  details,
  params,
  returnType,
  showSnippet
}: {
  node: DocNodeShared & { kind?: string };
  prefix?: string;
  details?: React.ReactNode;
  params?: ParamDef[];
  returnType?: TsTypeDef;
  showSnippet?: boolean;
}) {
  const paramElements = (params ?? []).flatMap(p => [
    <>
      {p.name}
      {p.tsType ? (
        <>
          : <TsType tsType={p.tsType} />
        </>
      ) : null}
    </>,
    ", "
  ]);
  paramElements.pop();

  return (
    <div
      className="shadow rounded-md my-3 bg-white p-2"
      id={`${node.kind}.${node.name}`}
    >
      <div className="text-lg">
        {prefix ? <span className="text-pink-800">{prefix} </span> : null}
        <span className="font-bold">{node.name}</span>
        {params ? (
          <span className="text-gray-600">({paramElements})</span>
        ) : null}
        {returnType ? (
          <span className="text-gray-600">
            {" → "}
            <TsType tsType={returnType}></TsType>
          </span>
        ) : null}
      </div>

      {showSnippet ? (
        <div className="mt-2">
          <CodeBlock value={node.snippet} />
        </div>
      ) : null}

      <div className="text-xs mt-1 text-gray-600">
        Defined in file '{node.location.filename}' on line {node.location.line},
        column {node.location.col}.
      </div>

      {node.jsDoc ? (
        <div className="text-xs mt-2">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}

      {details}
    </div>
  );
}

export function SimpleSubCard({
  node,
  prefix,
  params,
  returnType
}: {
  node: Omit<DocNodeShared, "location"> & {
    kind?: string;
    location?: DocNodeLocation;
  };
  prefix?: string;
  params?: ParamDef[];
  returnType?: TsTypeDef;
}) {
  const paramElements = (params ?? []).flatMap(p => [
    <>
      {p.name}
      {p.tsType ? (
        <>
          : <TsType tsType={p.tsType} />
        </>
      ) : null}
    </>,
    ", "
  ]);
  paramElements.pop();

  return (
    <div className="mt-2 py-1 px-2 rounded bg-gray-100">
      <div className="text-sm">
        {prefix ? <span className="text-pink-800">{prefix} </span> : null}
        <span>{node.name}</span>
        {params ? (
          <span className="text-gray-600">({paramElements})</span>
        ) : null}
        {returnType ? (
          <span className="text-gray-600">
            {" → "}
            <TsType tsType={returnType}></TsType>
          </span>
        ) : null}
      </div>
      {node.location ? (
        <div className="text-xs text-gray-600">
          Defined in file '{node.location.filename}' on line{" "}
          {node.location.line}, column {node.location.col}.
        </div>
      ) : null}
      {node.jsDoc ? (
        <div className="text-xs mt-1">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}
    </div>
  );
}
