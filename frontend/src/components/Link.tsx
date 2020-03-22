import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import { usePrefix } from "../util/prefix";

export function Link(props: LinkProps) {
  const prefix = usePrefix();
  return <RouterLink {...props} to={prefix + props.to} />;
}
