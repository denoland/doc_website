import { NextPage } from "next";
import Link from "next/link";
import { DocsData, getData, DataProvider } from "../util/data";
import { SinglePage } from "../components/SinglePage";

const Documentation: NextPage<{ error?: string; data?: DocsData }> = ({
  error,
  data
}) => {
  if (error || !data) {
    return (
      <div className="h-full flex justify-center items-center flex-col">
        <div className="text-gray-800 text-3xl">
          An error occured while loading the documentation.
        </div>
        <div className="text-lg mt-2">{error}</div>
        <Link href="/">
          <a className="text-blue-500 mt-4 text-xl">Go back home</a>
        </Link>
        <Link href="https://github.com/bartlomieju/deno_doc/issues">
          <a className="text-blue-500 mt-5 text-sm">Report Issue</a>
        </Link>
      </div>
    );
  }
  return (
    <DataProvider value={data}>
      <SinglePage />
    </DataProvider>
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
      )
    };
  } catch (err) {
    return { error: err?.message ?? err.toString() };
  }
};

export default Documentation;
