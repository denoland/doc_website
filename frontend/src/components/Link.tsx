import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { usePrefix } from "../util/prefix";

export function Link(props: Omit<LinkProps, "to"> & { href: string }) {
  const prefix = usePrefix();
  return (
    <RouterLink
      to={
        prefix.namespace +
        (props.href.startsWith("$")
          ? props.href.replace("$", prefix.node)
          : props.href)
      }
      {...props}
    />
  );
}
