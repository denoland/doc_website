import React from "react";
import { Page } from "./Page";
import { DocNodeEnum } from "../util/docs";
import { JSDoc } from "./JSDoc";

export const Enum = ({ enum: enum_ }: { enum: DocNodeEnum }) => {
  return (
    <Page>
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
