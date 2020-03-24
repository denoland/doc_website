import React from "react";
import { Page } from "./Page";
import { DocNodeInterface } from "../util/docs";
import { JSDoc } from "./JSDoc";
import { SimpleCard, SimpleSubCard } from "./SinglePage";

export function InterfaceCard({ node }: { node: DocNodeInterface }) {
  return (
    <SimpleCard
      node={node}
      prefix="interface"
      details={
        <>
          {node.interfaceDef.callSignatures.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Call Signatures</p>
              {node.interfaceDef.callSignatures.map(node => {
                return (
                  <SimpleSubCard
                    node={{ ...node, name: "" }}
                    params={node.params}
                    returnType={node.tsType}
                  />
                );
              })}
            </div>
          ) : null}
          {node.interfaceDef.properties.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Properties</p>
              {node.interfaceDef.properties.map(node => {
                return <SimpleSubCard node={node} returnType={node.tsType} />;
              })}
            </div>
          ) : null}
          {node.interfaceDef.methods.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Methods</p>
              {node.interfaceDef.methods.map(node => {
                return (
                  <SimpleSubCard
                    node={node}
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

export const Interface = ({
  interface: interface_
}: {
  interface: DocNodeInterface;
}) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {interface_.name} interface
          </div>
          {interface_.jsDoc ? <JSDoc jsdoc={interface_.jsDoc} /> : null}
        </div>
        <div className="text-sm">
          Defined in {interface_.location.filename}:{interface_.location.line}:
          {interface_.location.col}
        </div>
      </div>
    </Page>
  );
};
