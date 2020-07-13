// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeFunction, ParamDef, ObjectPatPropDef } from "../util/docs";
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

export function ObjectPatProp({
  prop,
  scope,
}: {
  prop: ObjectPatPropDef;
  scope: string[];
}) {
  switch (prop.kind) {
    case "assign":
    case "keyValue":
      return <>{prop.key}</>;
    case "rest":
      return (
        <>
          ...
          <Param param={prop.arg} scope={scope} />
        </>
      );
  }
}

export function Param({
  param: p,
  scope,
}: {
  param: ParamDef;
  scope: string[];
}) {
  switch (p.kind) {
    case "array": {
      return (
        <>
          [<Params params={p.elements} scope={scope} />]{p.optional && "?"}
          {p.tsType && (
            <span className="text-gray-600">
              : <TsType tsType={p.tsType} scope={scope} />
            </span>
          )}
        </>
      );
    }
    case "assign": {
      return (
        <>
          <Param param={p.left} scope={scope} />
          {p.tsType && (
            <span className="text-gray-600">
              : <TsType tsType={p.tsType} scope={scope} />
            </span>
          )}
        </>
      );
    }
    case "identifier": {
      return (
        <>
          {p.name}
          {p.optional && "?"}
          {p.tsType && (
            <span className="text-gray-600">
              : <TsType tsType={p.tsType} scope={scope} />
            </span>
          )}
        </>
      );
    }
    case "object": {
      return (
        <>
          {"{ "}
          {p.props
            .map((prop) => <ObjectPatProp prop={prop} scope={scope} />)
            .reduce((r, a) => (
              <>
                {r}, {a}
              </>
            ))}
          {" }"}
          {p.optional && "?"}
          {p.tsType && (
            <span className="text-gray-600">
              : <TsType tsType={p.tsType} scope={scope} />
            </span>
          )}
        </>
      );
    }
    case "rest": {
      return (
        <>
          ...
          <Param param={p.arg} scope={scope} />
          {p.tsType && (
            <span className="text-gray-600">
              : <TsType tsType={p.tsType} scope={scope} />
            </span>
          )}
        </>
      );
    }
  }
}

export function Params({
  params,
  scope,
}: {
  params: (ParamDef | null)[];
  scope: string[];
}) {
  return (
    <>
      {params
        .map((p) => {
          if (p === null) return <></>;
          return <Param param={p} scope={scope} />;
        })
        .reduce((r, a) => (
          <>
            {r}, {a}
          </>
        ))}
    </>
  );
}
