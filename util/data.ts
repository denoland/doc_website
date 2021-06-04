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

// A regex to determine if a provided url has a version and thus can be cached.
const HAS_VERSION_REGEX = /https:\/\/[d\w]+\.[d\w]+\/(x\/\w+|std)@\d*\.\d*\.\d*\/.+/g;

export async function getData(
  entrypoint: string,
  hostname: string,
  forceReload?: boolean
): Promise<DocsData> {
  // TODO: Use a smarter way to ensure that the entrypoint is tagged with a version, currently we
  // will get occasional cache misses for version-tagged entrypoints.
  const canBeCached = HAS_VERSION_REGEX.test(entrypoint);

  // Looks for the data cached in the local storage if we know that the entrypoint is tagged with a
  // version and we aren't forcing a reload.
  const cachedData =
    canBeCached && !forceReload
      ? window.localStorage.getItem(entrypoint)
      : null;

  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    const req = await fetch(
      `${hostname}/api/docs?entrypoint=${encodeURIComponent(entrypoint)}${
        forceReload ? "&force_reload=true" : ""
      }`
    );
    if (!req.ok) throw new Error((await req.json()).error);
    const resp = await req.json();
    const data = {
      timestamp: resp.timestamp,
      nodes: resp.nodes,
    };

    if (canBeCached) {
      try {
        window.localStorage.setItem(entrypoint, JSON.stringify(data));
      } catch (error) {
        // The local storage is either full or the user has disabled it's usage, so we'll just
        // ignore this error and not cache our result.
      }
    }

    return data;
  }
}
