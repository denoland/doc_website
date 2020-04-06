// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeEnum } from "../util/docs";
import { SimpleCard, SimpleSubCard } from "./SinglePage";

export function EnumCard({
  node,
  nested,
}: {
  node: DocNodeEnum;
  nested: boolean;
}) {
  return (
    <SimpleCard
      node={node}
      nested={nested}
      prefix="enum"
      details={
        <>
          <div className="mt-2">
            <p className="font-medium text-md">Members</p>
            {node.enumDef.members.length > 0 ? (
              node.enumDef.members.map((member) => {
                return <SimpleSubCard node={{ name: member.name }} />;
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
