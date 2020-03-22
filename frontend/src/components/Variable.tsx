import React from "react";
import { TsTypeDef } from "../util/docs";
import { SimpleLink } from "./SimpleLink";

export function VariableLink(props: {
  name: string;
  type: string;
  jsDoc?: string;
  returnType?: TsTypeDef;
  accessibility?: "private" | "protected" | "public";
  isAbstract?: boolean;
  readonly: boolean;
}) {
  return (
    <SimpleLink
      name={props.name}
      type={props.type}
      jsDoc={props.jsDoc}
      afterName={
        <>
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
            .concat(props.readonly ? "read-only" : "read / write")
            .join(", ")}
        </p>
      }
    />
  );
}
