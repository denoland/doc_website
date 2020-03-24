import { createContext, useContext } from "react";

const context = createContext<{
  global: string;
  namespace: string;
  node: string;
}>({
  global: "",
  namespace: "",
  node: ""
});

export function usePrefix() {
  return useContext(context);
}

export const PrefixProvider = context.Provider;
