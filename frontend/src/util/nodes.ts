import { createContext, useContext } from "react";
import { DocNode } from "./docs";

const context = createContext<DocNode[]>([]);

export function useNodes() {
  return useContext(context);
}

export const NodesProvider = context.Provider;
