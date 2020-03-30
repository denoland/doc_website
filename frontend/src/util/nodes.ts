import { createContext, useContext } from "react";
import { DataResponse } from "./docs";

const context = createContext<DataResponse>({
  nodes: [],
  timestamp: new Date()
});

export function useData() {
  return useContext(context);
}

export const DataProvider = context.Provider;
