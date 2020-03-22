import React from "react";
import { ParamDef, TsTypeDef } from "../util/docs";
import { SimpleLink } from "./SimpleLink";

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
            {props.params
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
