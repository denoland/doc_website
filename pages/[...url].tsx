import { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { getData, DataProvider, DocsData } from "../util/data";
import { SinglePage } from "../components/SinglePage";
import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";

const Documentation: NextPage<{}> = () => {
  const router = useRouter();
  const entrypoint =
    typeof router.query.url === "string"
      ? router.query.url
      : router.query.url.join("/");

  const [data, setData] = useState<DocsData>();
  const [error, setError] = useState<string>();
  const [loadCount, forceReload] = useReducer(i => ++i, 0);

  useEffect(() => {
    setData(null);
    setError(null);
    getData(entrypoint, "", loadCount > 0)
      .then(val => setData(val))
      .catch(err => setError(err?.message ?? err.toString()));
  }, [loadCount]);

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
      <div className="h-full flex justify-center items-center flex-col p-4 text-center">
        <div className="text-gray-800 text-3xl">{title}</div>
        <div className="text-lg mt-2">{details}</div>
        <Link href="/">
          <a className="text-blue-500 mt-4 text-xl">Go back home</a>
        </Link>
        <a
          href="https://github.com/bartlomieju/deno_doc/issues"
          className="text-blue-500 mt-5 text-sm"
        >
          Report Issue
        </a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{entrypoint} - deno doc</title>
        <meta
          name="description"
          content={`Automatically generated documentation for ${entrypoint}.`}
        />
      </Head>
      <DataProvider value={data}>
        <SinglePage forceReload={() => forceReload()} />
      </DataProvider>
    </>
  );
};

export default Documentation;
