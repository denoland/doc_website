// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import {
  DocNodeVariable,
  TsTypeDefKind,
  TsTypeDefTypeLiteral,
} from "../util/docs";
import { SimpleCard, SimpleSubCard } from "./SinglePage";

export function VariableCard({
  node,
  nested,
}: {
  node: DocNodeVariable;
  nested: boolean;
}) {
  const type = node.variableDef.tsType;
  const isNamespace =
    node.variableDef.kind === "const" &&
    type &&
    type.kind === TsTypeDefKind.TypeLiteral &&
    type.typeLiteral.properties.length > 0 &&
    type.typeLiteral.methods.length === 0 &&
    type.typeLiteral.callSignatures.length === 0;

  return isNamespace ? (
    <VariableNamespaceCard node={node} nested={nested} />
  ) : (
    <SimpleCard
      node={node}
      nested={nested}
      prefix={node.variableDef.kind}
      returnType={type}
    />
  );
}

export function VariableNamespaceCard({
  node,
  nested,
}: {
  node: DocNodeVariable;
  nested: boolean;
}) {
  const type = node.variableDef.tsType as TsTypeDefTypeLiteral;
  const parent = node;
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix={node.variableDef.kind}
      details={
        <div className="mt-2">
          <p className="font-medium text-md text-gray-800 dark:text-gray-300">
            Properties
          </p>
          {type.typeLiteral.properties.map((node) => {
            return (
              <SimpleSubCard
                node={{ name: node.name, scope: parent.scope }}
                returnType={node.tsType}
              />
            );
          })}
        </div>
      }
    />
  );
}
