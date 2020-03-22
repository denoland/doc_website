import { createContext, useContext } from "react";

const context = createContext<string>("");

export function usePrefix() {
  return useContext(context);
}

export const PrefixProvider = context.Provider;
