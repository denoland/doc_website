import React from "react";
import { DocNodeEnum } from "../util/docs";
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
