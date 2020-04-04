import { useReducer } from "react";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { getData, DataProvider, DocsData } from "../util/data";
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
      })
  );

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
          <a className="text-blue-600 mt-4 text-xl">Go back home</a>
        </Link>
        <a
          href="https://github.com/bartlomieju/deno_doc/issues"
          className="text-blue-600 mt-5 text-sm"
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
      <DataProvider value={data}>
        <SinglePage forceReload={() => forceReload()} entrypoint={entrypoint} />
      </DataProvider>
    </>
  );
};
