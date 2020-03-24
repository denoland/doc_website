import React from "react";
import { ParamDef, TsTypeDef, DocNodeFunction } from "../util/docs";
import { SimpleLink } from "./SimpleLink";
import { Page } from "./Page";
import { JSDoc, CodeBlock } from "./JSDoc";
import { SimpleCard } from "./SinglePage";

export function FunctionCard({ node }: { node: DocNodeFunction }) {
  return (
    <SimpleCard
      node={node}
      prefix="function"
      params={node.functionDef?.params}
      returnType={node.functionDef.returnType}
    />
  );
}

export const Function = ({
  function: function_
}: {
  function: DocNodeFunction;
}) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {function_.name} function
          </div>
          <div className="py-1">
            {function_.name}
            <span className="text-gray-600 font-light">
              (
              {function_.functionDef.params
                .map(p => `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`)
                .join(", ")}
              )
            </span>
            {function_.functionDef.returnType?.repr ? (
              <span className="text-gray-600 font-light">
                {" → "}
                {function_.functionDef.returnType?.repr}
              </span>
            ) : null}
          </div>
          {function_.jsDoc ? <JSDoc jsdoc={function_.jsDoc} /> : null}
        </div>
        <div className="py-4">
          <div className="text-gray-900 text-2xl font-medium">
            Implementation
          </div>
          <CodeBlock value={function_.snippet} />
        </div>
        <div className="text-sm">
          Defined in {function_.location.filename}:{function_.location.line}:
          {function_.location.col}
        </div>
      </div>
    </Page>
  );
};

export function FunctionLink(props: {
  name: string;
  type: string;
  jsDoc?: string;
  params: ParamDef[];
  returnType?: TsTypeDef;
  accessibility?: "private" | "protected" | "public";
  isAbstract?: boolean;
}) {
  return (
    <SimpleLink
      name={props.name}
      type={props.type}
      jsDoc={props.jsDoc}
      afterName={
        <>
          <span className="text-gray-600 font-light">
            (
            {props.params &&
              props.params
                .map(p => `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`)
                .join(", ")}
            )
          </span>
          {props.returnType?.repr ? (
            <>
              <span className="text-gray-600 font-light">
                {" → "}
                {props.returnType.repr}
              </span>
            </>
          ) : null}
        </>
      }
      afterJsDoc={
        <p className="text-gray-500 italic font-light">
          {([] as string[])
            .concat(...(props.accessibility === "private" ? ["private"] : []))
            .concat(
              ...(props.accessibility === "protected" ? ["protected"] : [])
            )
            .concat(...(props.isAbstract ? ["abstract"] : []))
            .join(", ")}
        </p>
      }
    />
  );
}
