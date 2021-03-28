// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { Documentation } from "../../components/Documentation";
import { NextPage } from "next";

const Page: NextPage<{
  entrypoint: string;
  name: string;
  importMap?: string;
}> = (props) => <Documentation {...props} />;

Page.getInitialProps = async (ctx) => {
  const url =
    typeof ctx.query.url === "string"
      ? ctx.query.url
      : ctx.query.url === undefined
      ? ""
      : ctx.query.url.join("/");

  const importMap = validateImportMap(ctx.query["import_map"]);

  return {
    entrypoint: "https://" + decodeURIComponent(url),
    name: decodeURIComponent(url),
    importMap,
  };
};

export default Page;

function validateImportMap(
  maybeImportMap: string[] | string | undefined
): string | undefined {
  if (typeof maybeImportMap !== "string") return undefined;

  let parsedImportMap;
  try {
    parsedImportMap = JSON.parse(maybeImportMap);
  } catch (err) {
    console.warn("invalid import map", maybeImportMap, err);
    return undefined;
  }

  if ("imports" in parsedImportMap || "scopes" in parsedImportMap) {
    return maybeImportMap;
  }

  console.warn(
    'import map is expected to have "imports" and/or "scopes" fields',
    maybeImportMap
  );

  return undefined;
}
