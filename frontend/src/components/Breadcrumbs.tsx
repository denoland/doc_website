import React from "react";
import { Link } from "./Link";
import { useLocation } from "react-router-dom";

export function Breadcrumbs() {
  const location = useLocation();

  const segments = location.pathname.split("/");

  let currentPath = "";
  const items: React.ReactNode[] =
    location.pathname !== "/"
      ? [
          <React.Fragment key={`namespace.root-1`}>
            <Link href="/" unmanaged className="text-blue-500">
              Root namespace
            </Link>
            {" > "}
          </React.Fragment>
        ]
      : [];

  for (let i = 0; i < segments.length / 2 - 2; i++) {
    const type = segments[i * 2 + 1];
    const name = segments[i * 2 + 2];
    currentPath += `/${type}/${name}`;
    items.push(
      <React.Fragment key={`${type}.${name}+${i}`}>
        <Link href={currentPath} unmanaged className="text-blue-500">
          {name} {type}
        </Link>
        {" > "}
      </React.Fragment>
    );
  }

  return items.length > 0 ? <div className="px-8 pt-4">{items}</div> : null;
}
