import React from "react";
import { Page } from "./Page";
import { DocNodeInterface } from "../util/docs";
import { JSDoc } from "./JSDoc";

export const Interface = ({
  interface: interface_
}: {
  interface: DocNodeInterface;
}) => {
  return (
    <Page>
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
