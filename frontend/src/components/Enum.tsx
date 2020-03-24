import React from "react";
import { Page } from "./Page";
import { DocNodeEnum } from "../util/docs";
import { JSDoc } from "./JSDoc";
import { SimpleCard, SimpleSubCard } from "./SinglePage";

export function EnumCard({ node }: { node: DocNodeEnum }) {
  return (
    <SimpleCard
      node={node}
      prefix="enum"
      details={
        <>
          <div className="mt-2">
            <p className="text-md font-medium">Members</p>
            {node.enumDef.members.length > 0 ? (
              node.enumDef.members.map(member => {
                return (
                  <SimpleSubCard node={{ name: member.name, snippet: "" }} />
                );
              })
            ) : (
              <div>This enum has no members.</div>
            )}
          </div>
        </>
      }
    />
  );
}

export const Enum = ({ enum: enum_ }: { enum: DocNodeEnum }) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {enum_.name} enum
          </div>
          {enum_.jsDoc ? <JSDoc jsdoc={enum_.jsDoc} /> : null}
        </div>
        {enum_.enumDef.members.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Members
            </div>
            <div>
              {enum_.enumDef.members.map(node => (
                <div className="py-1" key={node.name}>
                  {node.name}
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="text-sm">
          Defined in {enum_.location.filename}:{enum_.location.line}:
          {enum_.location.col}
        </div>
      </div>
    </Page>
  );
};
