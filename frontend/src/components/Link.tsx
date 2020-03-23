import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { usePrefix } from "../util/prefix";

export function Link(
  props: Omit<LinkProps, "to"> & { href: string; unmanaged?: boolean }
) {
  const prefix = usePrefix();
  return (
    <RouterLink
    
      to={
        props.unmanaged
          ? props.href
          : prefix.namespace +
            (props.href.startsWith("$")
              ? props.href.replace("$", prefix.node)
              : props.href)
      }
      {...props}
    />
  );
}
