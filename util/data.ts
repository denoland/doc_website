import { createContext, useContext } from "react";
import fetch from "isomorphic-unfetch";
import { DocNode } from "./docs";

const context = createContext<DocsData>({
  nodes: [],
  timestamp: ""
});

export function useData() {
  return useContext(context);
}

export const DataProvider = context.Provider;

export interface DocsData {
  timestamp: string;
  nodes: DocNode[];
}

export async function getData(
  entrypoint: string,
  hostname: string,
  forceReload?: boolean
): Promise<DocsData> {
  const req = await fetch(
    `${hostname}/api/docs?entrypoint=${encodeURIComponent(entrypoint)}${
      forceReload ? "&force_reload=true" : ""
    }`
  );
  if (!req.ok) throw new Error((await req.json()).error);
  const resp = await req.json();
  return {
    timestamp: resp.timestamp,
    nodes: resp.nodes
  };
}
