// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeInterface, findNodeByScopedName, DocNode } from "../util/docs";
import { SimpleCard, SimpleSubCard } from "./SinglePage";
import { TypeParams } from "./Class";
import { useFlattend } from "../util/data";
import Link from "next/link";

export function InterfaceCard({
  node,
  nested,
}: {
  node: DocNodeInterface;
  nested: boolean;
}) {
  const parent = node;
  const flattend = useFlattend();
  const extendsNodes: {
    [name: string]: DocNode | undefined;
  } = {};
  for (const name of node.interfaceDef.extends) {
    extendsNodes[name] = name
      ? findNodeByScopedName(flattend, name, node.scope ?? [])
      : undefined;
  }
  const extendsItems = Object.keys(extendsNodes).flatMap((name) => {
    const extendsNode = extendsNodes[name];
    return [
      extendsNode ? (
        <Link
          href="/https/[...url]"
          as={`#${extendsNode.scope ? extendsNode.scope.join(".") + "." : ""}${
            extendsNode.name
          }`}
        >
          <a className="link">{extendsNode.name}</a>
        </Link>
      ) : (
        name
      ),
      ", ",
    ];
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
          {Object.keys(extendsNodes).length > 0 ? (
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
        </>
      }
    />
  );
}
