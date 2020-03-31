import React from "react";
import { DocNodeInterface } from "../util/docs";
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
