import React from "react";
import { Page } from "./Page";
import { cleanJSDoc, DocNodeEnum } from "../util/docs";

export const Enum = ({ enum: enum_ }: { enum: DocNodeEnum }) => {
  return (
    <Page>
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {enum_.name} enum
          </div>
          {enum_.jsDoc ? (
            <p className="text-gray-700">{cleanJSDoc(enum_.jsDoc)}</p>
          ) : null}
        </div>
        {enum_.enumDef.members.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Members
            </div>
            <div>
              {enum_.enumDef.members.map((node) => (
                <div className="py-1" key={node.name}>
                  {node.name}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
};
