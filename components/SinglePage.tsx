// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React, { useMemo, memo } from "react";
import { DocsData, FlattendProvider } from "../util/data";
import {
  groupNodes,
  DocNodeShared,
  ParamDef,
  TsTypeDef,
  DocNodeLocation,
  sortByAlphabet,
  DocNode,
  expandNamespaces,
  flattenNamespaces,
} from "../util/docs";
import { JSDoc } from "./JSDoc";
import { ClassCard } from "./Class";
import { TsType } from "./TsType";
import { FunctionCard, Params } from "./Function";
import { EnumCard } from "./Enum";
import { InterfaceCard } from "./Interface";
import { VariableCard } from "./Variable";
import { TypeAliasCard } from "./TypeAlias";
import { Wrapper } from "./Wrapper";
import { NamespaceCard } from "./Namespace";
import { Loading } from "./Loading";

export const SinglePage = memo(
  (props: {
    forceReload: () => void;
    entrypoint: string;
    data: DocsData | undefined;
  }) => {
    const nodes = expandNamespaces(props.data?.nodes ?? []);

    if (!props.data) {
      return (
        <Wrapper
          forceReload={props.forceReload}
          entrypoint={props.entrypoint}
          timestamp=""
        >
          <div className="flex flex-col items-center justify-center h-full px-4 pb-3 sm:px-6 pt-8">
            <Loading></Loading>
            <div className="text-lg text-center text-gray-900">
              It can take a few seconds for documentation to be generated.
            </div>
          </div>
        </Wrapper>
      );
    }

    const hasNone = nodes.length === 0;

    const flattend = flattenNamespaces(nodes);

    return (
      <FlattendProvider value={flattend}>
        <Wrapper
          forceReload={props.forceReload}
          entrypoint={props.entrypoint}
          timestamp={props.data.timestamp}
        >
          <div className="max-w-screen-lg px-4 sm:px-6 md:px-8 pb-12">
            <div className="py-6">
              <a
                className="break-words cursor-pointer link"
                href={props.entrypoint}
              >
                {props.entrypoint}
              </a>
              {hasNone ? (
                <h1 className="pt-4 pb-1 text-xl text-gray-900">
                  This module has no exports that are recognized by deno doc.
                </h1>
              ) : (
                <CardList nodes={nodes} />
              )}
            </div>
          </div>
        </Wrapper>
      </FlattendProvider>
    );
  }
);

export const CardList = memo(
  ({ nodes, nested }: { nodes: DocNode[]; nested?: boolean }) => {
    const groups = useMemo(() => groupNodes(sortByAlphabet(nodes)), [nodes]);

    return (
      <>
        {groups.functions.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Functions
              </div>
            )}
            <div>
              {groups.functions.map((node, i) => (
                <FunctionCard
                  node={node}
                  nested={!!nested}
                  key={`$${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.variables.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Variables
              </div>
            )}
            <div>
              {groups.variables.map((node, i) => (
                <VariableCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.classes.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Classes
              </div>
            )}
            <div>
              {groups.classes.map((node, i) => (
                <ClassCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Enums
              </div>
            )}
            <div>
              {groups.enums.map((node, i) => (
                <EnumCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.interfaces.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Interfaces
              </div>
            )}
            <div>
              {groups.interfaces.map((node, i) => (
                <InterfaceCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.typeAliases.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Type Aliases
              </div>
            )}
            <div>
              {groups.typeAliases.map((node, i) => (
                <TypeAliasCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.namespaces.length > 0 ? (
          <div>
            {!nested && (
              <div className="leading-tight text-gray-900 font-bold text-2xl mt-8 mb-4">
                Namespaces
              </div>
            )}
            <div>
              {groups.namespaces.map((node, i) => (
                <NamespaceCard
                  node={node}
                  nested={!!nested}
                  key={`${node.name}+${i}`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </>
    );
  }
);

export function SimpleCard({
  node,
  prefix,
  details,
  suffix,
  params,
  returnType,
  nested,
}: {
  node: DocNodeShared & { kind?: string };
  prefix?: string;
  details?: React.ReactNode;
  suffix?: React.ReactNode;
  params?: ParamDef[];
  returnType?: TsTypeDef;
  nested: boolean;
}) {
  const id = (node.scope ?? []).concat(node.name).join(".");
  return (
    <div
      className={
        "mt-4 p-2 rounded-md border border-gray-200" +
        (nested ? "bg-gray-50" : "")
      }
      id={id}
    >
      <div className="flex justify-between">
        <div className="overflow-auto font-mono text-lg break-words">
          {prefix ? <span className="keyword">{prefix} </span> : null}
          {node.scope?.map((s, i) => (
            <>
              <a
                href={"#" + node.scope?.slice(0, i + 1).join(".")}
                className="pointer hover:underline"
              >
                {s}
              </a>
              .
            </>
          ))}
          <a href={"#" + id} className="pointer hover:underline">
            <span className="font-bold">{node.name}</span>
          </a>
          {params ? (
            <span className="text-gray-600">
              (<Params params={params} scope={node.scope ?? []} />)
            </span>
          ) : null}
          {returnType ? (
            <span className="text-gray-600 ">
              {": "}
              <TsType tsType={returnType} scope={node.scope ?? []} />
            </span>
          ) : null}
          {suffix}
        </div>
        <a
          href={node.location.filename + "#L" + node.location.line}
          className="pl-2 text-gray-600 break-words hover:text-gray-800 hover:underline"
        >
          [src]
        </a>
      </div>

      {node.jsDoc ? (
        <div className="mt-2 text-xs">
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
  optional,
  computedParams,
  params,
  returnType,
}: {
  node: Omit<DocNodeShared, "location"> & {
    kind?: string;
    location?: DocNodeLocation;
    inherited?: boolean;
  };
  prefix?: string;
  optional?: boolean;
  computedParams?: ParamDef[];
  params?: ParamDef[];
  returnType?: TsTypeDef;
}) {
  return (
    <div className="px-2 py-1 mt-2 bg-gray-100 rounded">
      <div className="flex justify-between">
        <div
          className={
            "font-mono text-sm break-words" +
            (node.inherited ? " italic opacity-50" : "")
          }
        >
          {node.inherited ? (
            <span className="text-gray-600">inherited </span>
          ) : null}
          {prefix ? <span className="keyword">{prefix} </span> : null}
          {node.name}
          {optional ? "?" : ""}
          {computedParams ? (
            <>
              [<Params params={computedParams} scope={node.scope ?? []} />]
            </>
          ) : null}
          {params ? (
            <span className="text-gray-600">
              (<Params params={params} scope={node.scope ?? []} />)
            </span>
          ) : null}
          {returnType ? (
            <span className="text-gray-600">
              {": "}
              <TsType tsType={returnType} scope={node.scope ?? []} />
            </span>
          ) : null}
        </div>
        {node.location ? (
          <a
            href={node.location.filename + "#L" + node.location.line}
            className="pl-2 text-xs text-gray-600 break-words hover:text-gray-800 hover:underline"
          >
            [src]
          </a>
        ) : null}
      </div>
      {node.jsDoc ? (
        <div className="mt-1 text-xs">
          <JSDoc jsdoc={node.jsDoc} />
        </div>
      ) : null}
    </div>
  );
}
