import React from "react";
import { Link } from "./Link";
import { cleanJSDoc } from "../util/docs";

export function SimpleLink(props: {
  name: string;
  type: string;
  jsDoc?: string;
  afterName?: React.ReactElement;
  afterJsDoc?: React.ReactElement;
}) {
  return (
    <div className="py-2" key={props.name}>
      <p>
        <Link href={`$/${props.type}/${props.name}`} className="text-blue-500">
          {props.name}
        </Link>
        {props.afterName}
      </p>
      {props.jsDoc ? (
        <p className="text-gray-700">{cleanJSDoc(props.jsDoc)}</p>
      ) : null}
      {props.afterJsDoc}
    </div>
  );
}
