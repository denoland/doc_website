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
const HAS_VERSION_REGEX = /https:\/\/deno\.land\/(x\/[a-z0-9][a-z0-9_]+[a-z0-9]|std)@\d*\.\d*\.\d*\/.+/g;

export async function getData(
  entrypoint: string,
  hostname: string,
  forceReload?: boolean
): Promise<DocsData> {
  // TODO: Use a smarter way to ensure that the entrypoint is tagged with a version, currently we
  // will get occasional cache misses for version-tagged entrypoints.
  const canBeCached = HAS_VERSION_REGEX.test(entrypoint);
  const cacheKey = `cached-entrypoint-${entrypoint}`;
  // Looks for the data cached in the local storage if we know that the entrypoint is tagged with a
  // version and we aren't forcing a reload.
  const cachedData =
    canBeCached && !forceReload ? window.localStorage.getItem(cacheKey) : null;

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

    const dataStringified = JSON.stringify(data);

    if (canBeCached) {
      try {
        window.localStorage.setItem(cacheKey, dataStringified);
      } catch (error) {
        // The local storage is either full or the user has disabled it's usage. We'll try to evict
        // some of the oldest items in the cache to make space.

        // Reads all of the cached items in the local storage and pairs them with the data and the
        // size of the entry.
        const cacheTuples = [...new Array(window.localStorage.length)]
          .map((_, i) => window.localStorage.key(i))
          .filter(
            (key): key is string =>
              key?.startsWith("cached-entrypoint-") ?? false
          )
          .map((key): [string, DocsData, number] => {
            const data = window.localStorage.getItem(key)!;
            return [key, JSON.parse(data) as DocsData, data.length];
          })
          .sort(
            ([_aKey, a], [_bKey, b]) =>
              Date.parse(a.timestamp) - Date.parse(b.timestamp)
          );

        let deletedData = 0;

        // Removes items from the local storage until we have enough to store the new data.
        for (const [key, _, sizeInStorage] of cacheTuples) {
          if (deletedData >= dataStringified.length) {
            break;
          }

          window.localStorage.removeItem(key);
          deletedData += sizeInStorage;
        }

        // Tries to cache the key again, after clearing enough space for it.
        window.localStorage.setItem(cacheKey, dataStringified);
      }
    }

    return data;
  }
}
