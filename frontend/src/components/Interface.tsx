import React from "react";
import { Page } from "./Page";
import { cleanJSDoc, DocNodeInterface } from "../util/docs";

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
          {interface_.jsDoc ? (
            <p className="text-gray-700">{cleanJSDoc(interface_.jsDoc)}</p>
          ) : null}
        </div>
      </div>
    </Page>
  );
};
