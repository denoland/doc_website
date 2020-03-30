import React from "react";
import { DataResponse } from "../util/docs";
import { DataProvider } from "../util/nodes";
import { SinglePage } from "../components/SinglePage";

export function SinglePageRoute(props: { data: DataResponse }) {
  return (
    <DataProvider value={props.data}>
      <SinglePage />
    </DataProvider>
  );
}
