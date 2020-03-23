import React from "react";
import { Page } from "./Page";
import { cleanJSDoc, DocNodeTypeAlias } from "../util/docs";

export const TypeAlias = ({
  typealias: typealias_,
}: {
  typealias: DocNodeTypeAlias;
}) => {
  return (
    <Page>
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {typealias_.name} type alias
          </div>
          {typealias_.jsDoc ? (
            <p className="text-gray-700">{cleanJSDoc(typealias_.jsDoc)}</p>
          ) : null}
        </div>
        <div className="py-4">
          <div className="text-gray-900 text-2xl font-medium mb-1">
            Type Representation
          </div>
          {/* TODO(lucacasonato): better code formatting */}
          <div className="py-1">{typealias_.typeAliasDef.tsType?.repr}</div>
        </div>
      </div>
    </Page>
  );
};
