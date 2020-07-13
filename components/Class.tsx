// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import {
  DocNodeClass,
  findNodeByScopedName,
  getFieldsForClassRecursive,
  ParamDef,
  TsTypeParamDef,
} from "../util/docs";
import { SimpleCard, SimpleSubCard } from "./SinglePage";
import { useFlattend } from "../util/data";
import Link from "next/link";
import { TsType } from "./TsType";

export function ClassCard({
  node,
  nested,
}: {
  node: DocNodeClass;
  nested: boolean;
}) {
  const constructors = node.classDef.constructors;
  const indexSignatures = node.classDef.indexSignatures;

  const flattend = useFlattend();
  const fullClass = getFieldsForClassRecursive(flattend, node);

  const properties = fullClass.properties.filter(
    (node) => node.accessibility !== "private"
  );
  const realProperties = properties.filter((node) => !node.isStatic);
  const staticProperties = properties.filter((node) => node.isStatic);
  const methods = fullClass.methods.filter(
    (node) => node.accessibility !== "private"
  );
  const realMethods = methods.filter((node) => !node.isStatic);
  const staticMethods = methods.filter((node) => node.isStatic);

  const parent = node;

  const { extends: extends_ } = node.classDef;
  const extendsNode = extends_
    ? findNodeByScopedName(flattend, extends_, node.scope ?? [])
    : undefined;

  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix={`${node.classDef.isAbstract ? "abstract " : ""} class`}
      suffix={
        <>
          {node.classDef.typeParams.length > 0 ? (
            <span className="text-gray-600">
              {"<"}
              <TypeParams
                params={node.classDef.typeParams}
                scope={node.scope ?? []}
              />
              {">"}
            </span>
          ) : null}
          {node.classDef.extends ? (
            <>
              {" "}
              <span className="keyword">extends</span>{" "}
              {extendsNode ? (
                <Link
                  href="/https/[...url]"
                  as={`#${
                    extendsNode.scope ? extendsNode.scope.join(".") + "." : ""
                  }${extendsNode.name}`}
                >
                  <a className="link">{extendsNode.name}</a>
                </Link>
              ) : (
                extends_
              )}
              {node.classDef.superTypeParams.length > 0 ? (
                <span className="text-gray-600">
                  {"<"}
                  {node.classDef.superTypeParams
                    .map((tsType) => (
                      <TsType tsType={tsType} scope={node.scope ?? []} />
                    ))
                    .reduce((r, a) => (
                      <>
                        {r}, {a}
                      </>
                    ))}
                  {">"}
                </span>
              ) : null}
            </>
          ) : null}
        </>
      }
      details={
        <>
          {constructors.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Constructors</p>
              {constructors.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    params={node.params}
                  />
                );
              })}
            </div>
          ) : null}
          {realProperties.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Properties</p>
              {realProperties.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    optional={node.optional}
                    prefix={`${
                      node.accessibility ? node.accessibility + " " : ""
                    }${node.isAbstract ? "abstract " : ""}${
                      node.readonly ? "readonly " : ""
                    }`}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {realMethods.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Methods</p>
              {realMethods.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    prefix={`${
                      node.accessibility ? node.accessibility + " " : ""
                    }${node.isAbstract ? "abstract " : ""}${
                      node.kind === "getter"
                        ? "get "
                        : node.kind === "setter"
                        ? "set "
                        : ""
                    }`}
                    optional={node.optional}
                    params={node.functionDef.params}
                    returnType={node.functionDef.returnType}
                  />
                );
              })}
            </div>
          ) : null}
          {indexSignatures.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Index Signatures</p>
              {indexSignatures.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, name: "", scope: parent.scope }}
                    prefix={node.readonly ? "readonly " : ""}
                    computedParams={node.params}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {staticProperties.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Static Properties</p>
              {staticProperties.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    prefix={`${
                      node.accessibility ? node.accessibility + " " : ""
                    }${node.isAbstract ? "abstract " : ""}${
                      node.readonly ? "readonly " : ""
                    }`}
                    optional={node.optional}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {staticMethods.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Static Methods</p>
              {staticMethods.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    prefix={`${
                      node.accessibility ? node.accessibility + " " : ""
                    }${node.isAbstract ? "abstract " : ""}${
                      node.kind === "getter"
                        ? "get "
                        : node.kind === "setter"
                        ? "set "
                        : ""
                    }`}
                    optional={node.optional}
                    params={node.functionDef.params}
                    returnType={node.functionDef.returnType}
                  />
                );
              })}
            </div>
          ) : null}
        </>
      }
    />
  );
}

export function TypeParams({
  params,
  scope,
}: {
  params: TsTypeParamDef[];
  scope: string[];
}) {
  return (
    <>
      {params
        .map((p) => {
          return (
            <>
              {p.name}
              {p.constraint ? (
                <>
                  {" "}
                  extends <TsType tsType={p.constraint} scope={scope} />
                </>
              ) : null}
              {p.default ? (
                <>
                  {" "}
                  = <TsType tsType={p.default} scope={scope} />
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
