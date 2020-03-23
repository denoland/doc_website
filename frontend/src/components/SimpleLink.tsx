import React from "react";
import { Link } from "./Link";
import { JSDoc } from "./JSDoc";

export function SimpleLink(props: {
  name: string;
  type: string;
  jsDoc?: string;
  afterName?: React.ReactNode;
  afterJsDoc?: React.ReactNode;
}) {
  return (
    <div className="py-2" key={props.name}>
      <p>
        <Link href={`$/${props.type}/${props.name}`} className="text-blue-500">
          {props.name}
        </Link>
        {props.afterName}
      </p>
      {props.jsDoc ? <JSDoc jsdoc={props.jsDoc} short /> : null}
      {props.afterJsDoc}
    </div>
  );
}
