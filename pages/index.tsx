// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

const examples = [
  "deno.land/std/http/mod.ts",
  "deno.land/std/fs/mod.ts",
  "deno.land/x/oak/mod.ts",
  "deno.land/x/redis/redis.ts",
  "deno.land/x/amqp/amqp.ts",
  "cdn.pika.dev/lodash-es",
  "deno.land/std/archive/tar.ts",
  "deno.land/std/node/module.ts",
];

const Home = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  function navigate() {
    router.push(
      "/https/[...url]",
      "/https/" + url.replace("https://", "").replace("http://", "")
    );
  }
  return (
    <>
      <Head>
        <title>deno doc</title>
        <meta
          name="description"
          content="Automatic documentation generator for Deno, a secure runtime for
              JavaScript and TypeScript."
        />
      </Head>
      <div className="flex flex-col max-w-4xl px-4 py-4 mx-auto sm:px-8 md:px-12 md:py-8">
        <div className="flex flex-col items-center sm:flex-row">
          <img src="/logo.svg" className="w-48" alt="Deno logo" />
          <div className="text-center md:ml-4 sm:text-left">
            <h1 className="text-4xl font-bold">deno doc</h1>
            <p>
              Automatic documentation generator for Deno, a secure runtime for
              JavaScript and TypeScript.
            </p>
          </div>
        </div>
        <hr className="mt-4 sm:hidden" />
        <label className="mt-4 font-bold" htmlFor="entrypoint">
          View documentation for:
        </label>
        <div className="flex flex-row mt-1">
          <input
            id="entrypoint"
            className="block w-full px-4 py-2 leading-normal bg-white border border-gray-300 rounded-lg outline-none appearance-none focus:border-gray-500"
            type="url"
            placeholder="https://deno.land/std/http/mod.ts"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.length > 0) navigate();
            }}
          />
          <button
            className="px-4 py-2 ml-2 font-bold leading-normal text-white duration-100 bg-gray-900 border border-gray-300 rounded-lg appearance-none hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:border-gray-500 focus:outline-none"
            onClick={() => {
              if (url.length > 0) navigate();
            }}
          >
            View
          </button>
        </div>
        <div className="mt-1">
          or{" "}
          <Link
            href="/https/[...url]"
            as={`/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts`}
          >
            <a className="link">view the Deno runtime documentation</a>
          </Link>
          .
        </div>
        <div className="mt-4 font-bold">Some other examples:</div>
        <ul className="list-disc">
          {examples.map((example) => (
            <li key={example} className="ml-6">
              <Link href="/https/[...url]" as={`/https/${example}`}>
                <a className="break-words link">https://{example}</a>
              </Link>
            </li>
          ))}
        </ul>
        <hr className="mt-6" />
        <div className="mt-6">
          <p className="font-bold">Other resources:</p>
          <ul className="list-disc">
            <li className="ml-6">
              <a href="https://deno.land" className="link">
                Website
              </a>
            </li>
            <li className="ml-6">
              <a href="https://deno.land/std/manual.md" className="link">
                Manual
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
