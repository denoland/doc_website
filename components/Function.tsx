// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeFunction, ParamDef, ParamKind } from "../util/docs";
import { SimpleCard } from "./SinglePage";
import { TsType } from "./TsType";

export function FunctionCard({
  node,
  nested,
}: {
  node: DocNodeFunction;
  nested: boolean;
}) {
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="function"
      params={node.functionDef?.params}
      returnType={node.functionDef.returnType}
    />
  );
}

export function Params({
  params,
  scope,
}: {
  params: ParamDef[];
  scope: string[];
}) {
  return (
    <>
      {params
        .map((p) => {
          let name = p.name;
          switch (p.kind) {
            case ParamKind.Array:
            case ParamKind.Object:
              name = "_";
              break;
          }
          return (
            <>
              {p.kind === ParamKind.Rest ? "..." : ""}
              {name}
              {p.tsType ? (
                <>
                  : <TsType tsType={p.tsType} scope={scope} />
                </>
              ) : null}
            </>
          );
        })
        .reduce((r, a) => (
          <>
            {r}, {a}
          </>
        ))}
    </>
  );
}
