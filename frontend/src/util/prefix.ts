import { createContext, useContext } from "react";

const context = createContext<{ namespace: string; node: string }>({
  namespace: "",
  node: ""
});

export function usePrefix() {
  return useContext(context);
}

export const PrefixProvider = context.Provider;
