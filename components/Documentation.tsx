// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React, { useReducer, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { getData, DocsData } from "../util/data";
import { SinglePage } from "./SinglePage";

export const Documentation = ({
  entrypoint,
  name,
}: {
  entrypoint: string;
  name: string;
}) => {
  const [loadCount, forceReload] = useReducer((i) => ++i, 0);
  const { data, error } = useSWR<DocsData, string>(
    [entrypoint, loadCount],
    () =>
      getData(entrypoint, "", loadCount > 0).catch((err) => {
        throw err?.message ?? err.toString();
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  const { data: runtimeBuiltinsData } = useSWR<DocsData>(
    [loadCount],
    () =>
      getData(
        "https://github.com/denoland/deno/releases/latest/download/lib.deno.d.ts",
        "",
        loadCount > 0
      ).catch((err) => {
        throw err?.message ?? err.toString();
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  useEffect(() => {
    let { hash } = location;
    hash = hash && hash.substring(1);
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    setTimeout(() => el.scrollIntoView(), 0);
  }, [data]);

  if (error) {
    let title =
      "A internal server error occured while generating the documentation.";
    let details = error;

    if (error && (error.includes("404") || error.includes("dns"))) {
      const file = (error.match(/Import '(.*)' failed/) ?? [])[1] ?? "";
      title = "404 - A source file could not be found.";
      details = `Please check that the ${
        file ? `file '${file}'` : "entrypoint and its dependents are"
      }  available on the public internet.`;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center bg-white dark:bg-light-black-800">
        <div className="text-3xl text-gray-800 dark:text-gray-200">{title}</div>
        <div className="mt-2 text-lg text-gray-800 dark:text-gray-200">
          {details}
        </div>
        <Link href="/">
          <a className="mt-4 text-xl link">Go back home</a>
        </Link>
        <a
          href="https://github.com/denoland/doc_website/issues"
          className="mt-5 text-sm link"
        >
          Report Issue
        </a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{name} - deno doc</title>
        <meta
          name="description"
          content={`Automatically generated documentation for ${name}.`}
        />
      </Head>
      <SinglePage
        forceReload={forceReload}
        entrypoint={entrypoint}
        data={data}
        runtimeBuiltinsData={runtimeBuiltinsData}
      />
    </>
  );
};
