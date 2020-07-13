// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeInterface } from "../util/docs";
import { SimpleCard, SimpleSubCard } from "./SinglePage";
import { TypeParams } from "./Class";
import { TsType } from "./TsType";

export function InterfaceCard({
  node,
  nested,
}: {
  node: DocNodeInterface;
  nested: boolean;
}) {
  const parent = node;
  const extendsItems = node.interfaceDef.extends.flatMap((tsType) => {
    return [<TsType tsType={tsType} scope={parent.scope ?? []} />, ", "];
  });
  extendsItems.pop();
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="interface"
      suffix={
        <>
          {node.interfaceDef.typeParams.length > 0 ? (
            <span className="text-gray-600">
              {"<"}
              <TypeParams
                params={node.interfaceDef.typeParams}
                scope={node.scope ?? []}
              />
              {">"}
            </span>
          ) : null}
          {extendsItems.length > 0 ? (
            <>
              {" "}
              <span className="keyword">extends</span> {extendsItems}
            </>
          ) : null}
        </>
      }
      details={
        <>
          {node.interfaceDef.callSignatures.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Call Signatures</p>
              {node.interfaceDef.callSignatures.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, name: "", scope: parent.scope }}
                    params={node.params}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {node.interfaceDef.properties.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Properties</p>
              {node.interfaceDef.properties.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    optional={node.optional}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {node.interfaceDef.methods.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Methods</p>
              {node.interfaceDef.methods.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ ...node, scope: parent.scope }}
                    optional={node.optional}
                    params={node.params}
                    returnType={node.returnType}
                  />
                );
              })}
            </div>
          ) : null}
          {node.interfaceDef.indexSignatures.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium text-md">Index Signatures</p>
              {node.interfaceDef.indexSignatures.map((node) => {
                return (
                  <SimpleSubCard
                    node={{ name }}
                    prefix={node.readonly ? "readonly " : ""}
                    computedParams={node.params}
                    returnType={node.tsType}
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
