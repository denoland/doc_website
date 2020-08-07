// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { createContext, useContext } from "react";
import fetch from "isomorphic-unfetch";
import { DocNode } from "./docs";

const flattendContext = createContext<DocNode[]>([]);

export function useFlattend() {
  return useContext(flattendContext);
}

export const FlattendProvider = flattendContext.Provider;

const runtimeBuiltinsContext = createContext<DocNode[] | undefined>([]);

export function useRuntimeBuiltins() {
  return useContext(runtimeBuiltinsContext);
}

export const RuntimeBuiltinsProvider = runtimeBuiltinsContext.Provider;

export interface DocsData {
  timestamp: string;
  nodes: DocNode[];
}

export async function getData(
  entrypoint: string,
  hostname: string,
  forceReload?: boolean,
): Promise<DocsData> {
  const req = await fetch(
    `${hostname}/api/docs?entrypoint=${encodeURIComponent(entrypoint)}${
      forceReload ? "&force_reload=true" : ""
    }`,
  );
  if (!req.ok) throw new Error((await req.json()).error);
  const resp = await req.json();
  return {
    timestamp: resp.timestamp,
    nodes: resp.nodes,
  };
}
