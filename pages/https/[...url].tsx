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

  const entrypoint = "https://" + decodeURIComponent(url);
  const importMap = tryResolveImportMap(ctx.query["import_map"], entrypoint);

  return {
    entrypoint,
    name: decodeURIComponent(url),
    importMap,
  };
};

export default Page;

function tryResolveImportMap(
  maybeImportMap: string[] | string | undefined,
  entrypoint: string
): string | undefined {
  if (typeof maybeImportMap !== "string") return;

  // If maybeImportMap is a path to an importMap, resolve it relatively to the entrypoint URL.
  let resolvedImportMapURL;
  try {
    resolvedImportMapURL = new URL(maybeImportMap, entrypoint);
    return resolvedImportMapURL.href;
  } catch {}

  // Otherwise, check if that's a strigified JSON import map.
  try {
    const parsedImportMap = JSON.parse(maybeImportMap);
    if (!("imports" in parsedImportMap) && !("scopes" in parsedImportMap)) {
      console.warn(
        'import map is expected to have "imports" and/or "scopes" fields',
        maybeImportMap
      );
      return;
    }

    return maybeImportMap;
  } catch (err) {
    console.warn("invalid import map", maybeImportMap, err);
    return;
  }
}
