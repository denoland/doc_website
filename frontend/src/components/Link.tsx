import React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

export function Link(props: Omit<LinkProps, "to"> & { href: string }) {
  return <RouterLink to={props.href} {...props} />;
}
