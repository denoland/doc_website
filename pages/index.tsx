// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const examples = [
  "deno.land/std/http/mod.ts",
  "deno.land/std/fs/mod.ts",
  "deno.land/x/oak/mod.ts",
  "deno.land/x/redis/mod.ts",
  "deno.land/x/amqp/mod.ts",
  "cdn.pika.dev/lodash-es",
  "deno.land/std/archive/tar.ts",
  "deno.land/std/node/module.ts",
];

function Home() {
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
      <div className="bg-white dark:bg-light-black-800">
        <div className="bg-gray-50 dark:bg-light-black-900 border-b border-gray-200 dark:border-light-black-700">
          <Header />
          <div className="max-w-screen-sm mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-12 pb-12 sm:pb-20 flex flex-col items-center">
            <span className="block w-full rounded-md shadow-sm ">
              <Link href="/builtin/[version]" as={`/builtin/stable`}>
                <a
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-light-black-700 dark:hover:border-light-black-600 text-md font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-light-black-800 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-light-black-700 focus:outline-none focus:shadow-outline-gray focus:border-gray-600 active:bg-gray-100 dark:active:bg-light-black-700 active:text-gray-700 dark:active:text-gray-100 transition duration-150 ease-in-out"
                >
                  Deno runtime documentation
                </a>
              </Link>
            </span>
            <label className="block text-center text-md leading-6 text-gray-500 dark:text-gray-300 mt-4">
              or view documentation for
            </label>
            <div className="mt-4 flex rounded-md shadow-sm w-full">
              <div className="relative flex-grow focus-within:z-10">
                <label htmlFor="link" className="sr-only">
                  Source link
                </label>
                <input
                  id="link"
                  className="form-input dark:text-gray-100 dark:bg-light-black-800 dark:border-light-black-700 dark:placeholder-text-gray-200 block w-full focus:shadow-outline-gray focus:border-gray-600 rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-md sm:leading-6"
                  placeholder="https://deno.land/x/oak/mod.ts"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && url.length > 0) navigate();
                  }}
                />
              </div>
              <button
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-light-black-700 dark:hover:border-light-black-600 text-md font-medium rounded-r-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-light-black-800 hover:text-gray-500 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-light-black-700 focus:outline-none focus:shadow-outline-gray focus:border-gray-600 active:bg-gray-100 dark:active:bg-light-black-700 active:text-gray-700 dark:active:text-gray-100 transition duration-150 ease-in-out"
                onClick={() => {
                  if (url.length > 0) navigate();
                }}
              >
                <span className="mr-2">View</span>{" "}
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col max-w-screen-sm px-4 py-4 mx-auto sm:px-8 md:px-12 mt-8 mb-16 text-gray-900 dark:text-gray-100">
          <div className="mt-1 py-2">
            View{" "}
            <code className="py-0.5 px-1 font-mono rounded-sm bg-gray-100 dark:bg-light-black-900 deno-inlinecode">
              --unstable
            </code>{" "}
            runtime documentation{" "}
            <Link href="/builtin/[version]" as={`/builtin/unstable`}>
              <a className="link"> here</a>
            </Link>
            .
          </div>
          <div className="mt-4 font-bold">Some examples:</div>
          <ul className="list-disc pl-8 mt-2">
            {examples.map((example) => (
              <li className="py-0.5" key={example}>
                <Link href="/https/[...url]" as={`/https/${example}`}>
                  <a className="break-words link">https://{example}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
