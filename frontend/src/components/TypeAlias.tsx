import React from "react";
import { Page } from "./Page";
import { DocNodeTypeAlias } from "../util/docs";
import { JSDoc, CodeBlock } from "./JSDoc";

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
          {typealias_.jsDoc ? <JSDoc jsdoc={typealias_.jsDoc} /> : null}
        </div>
        <div className="py-4">
          <div className="text-gray-900 text-2xl font-medium mb-1">
            Type Representation
          </div>
          <CodeBlock value={typealias_.typeAliasDef.tsType?.repr} />
        </div>
        <div className="text-sm">
          Defined in {typealias_.location.filename}:{typealias_.location.line}:
          {typealias_.location.col}
        </div>
      </div>
    </Page>
  );
};
