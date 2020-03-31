import { NextPage } from "next";
import Link from "next/link";
import { DocsData, getData, DataProvider } from "../util/data";
import { SinglePage } from "../components/SinglePage";
import Head from "next/head";

const Documentation: NextPage<{
  error?: string;
  data?: DocsData;
  entrypoint: string;
}> = ({ error, data, entrypoint }) => {
  if (error || !data) {
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
        <SinglePage />
      </DataProvider>
    </>
  );
};

Documentation.getInitialProps = async ctx => {
  const entrypoint =
    typeof ctx.query.url === "string" ? ctx.query.url : ctx.query.url.join("/");
  try {
    return {
      data: await getData(
        entrypoint,
        typeof window !== "undefined"
          ? ""
          : ctx.req.headers["x-forwarded-proto"].toString() +
              "://" +
              ctx.req.headers["x-forwarded-host"].toString()
      ),
      entrypoint
    };
  } catch (err) {
    return { error: err?.message ?? err.toString(), entrypoint };
  }
};

export default Documentation;
