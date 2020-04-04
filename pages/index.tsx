import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

const Home = () => {
  const examples = [
    "deno.land/std/http/mod.ts",
    "deno.land/std/fs/copy.ts",
    "deno.land/x/oak/mod.ts",
  ];
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
      <div className="px-4 sm:px-8 md:px-12 py-4 md:py-8 max-w-4xl mx-auto flex flex-col">
        <div className="flex flex-col sm:flex-row items-center">
          <img src="/logo.svg" className="w-48" />
          <div className="md:ml-4 text-center sm:text-left">
            <h1 className="text-4xl font-bold">deno doc</h1>
            <p>
              Automatic documentation generator for Deno, a secure runtime for
              JavaScript and TypeScript.
            </p>
          </div>
        </div>
        <hr className="mt-4 sm:hidden" />
        <div className="mt-4 font-bold">View documentation for:</div>
        <div className="mt-1 flex flex-row">
          <input
            className="bg-white border border-gray-300 focus:border-gray-500 rounded-lg py-2 px-4 block w-full appearance-none leading-normal outline-none"
            type="url"
            placeholder="https://deno.land/std/http/mod.ts"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && url.length > 0) navigate();
            }}
          />
          <button
            className="bg-gray-900 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 border border-gray-300 focus:border-gray-500 text-white font-bold py-2 px-4 rounded-lg duration-100 ml-2 appearance-none leading-normal focus:outline-none"
            onClick={() => {
              if (url.length > 0) navigate();
            }}
          >
            View
          </button>
        </div>
        <div className="mt-1">
          or{" "}
          <Link href="/deno@latest">
            <a className="text-blue-500">view the Deno runtime documentation</a>
          </Link>
          .
        </div>
        <div className="mt-4 font-bold">Some other examples:</div>
        <ul className="list-disc">
          {examples.map((example) => (
            <li key={example} className="ml-6">
              <Link href="/https/[...url]" as={`/https/${example}`}>
                <a className="text-blue-500 break-words">https://{example}</a>
              </Link>
            </li>
          ))}
        </ul>
        <hr className="mt-6" />
        <div className="mt-6">
          <p className="font-bold">Other resources:</p>
          <ul className="list-disc">
            <li className="ml-6">
              <a href="https://deno.land" className="text-blue-500">
                Website
              </a>
            </li>
            <li className="ml-6">
              <a
                href="https://deno.land/std/manual.md"
                className="text-blue-500"
              >
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
