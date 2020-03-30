import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

const Home = () => {
  const examples = [
    "deno.land/std/http/mod.ts",
    "deno.land/std/encoding/yaml.ts",
    "deno.land/x/oak/mod.ts"
  ];
  const router = useRouter();
  return (
    <>
      <Head>
        <title>deno_doc</title>
      </Head>
      <div className=" px-4 py-8 md:px-12 max-w-4xl mx-auto flex flex-col">
        <div className="flex flex-col md:flex-row items-center">
          <img src="/logo.svg" className="w-48" />
          <div className="md:ml-4 text-center md:text-left">
            <h1 className="text-4xl font-bold">deno doc</h1>
            <p>
              Automatic documentation generator for Deno, a secure runtime for
              JavaScript and TypeScript.
            </p>
          </div>
        </div>
        <div className="mt-4 font-bold">View documentation for:</div>
        <div className="mt-1 flex flex-row">
          <input
            className="bg-white border border-gray-300 focus:border-gray-500 rounded-lg py-2 px-4 block w-full appearance-none leading-normal outline-none"
            type="url"
            placeholder="https://deno.land/std/http/mod.ts"
          />
          <button className="bg-gray-900 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 border border-gray-300 focus:border-gray-500 text-white font-bold py-2 px-4 rounded-lg duration-100 ml-2 appearance-none leading-normal focus:outline-none">
            View
          </button>
        </div>
        <div className="mt-4 font-bold">Some examples:</div>
        <ul className="list-disc">
          {examples.map(example => (
            <li key={example} className="ml-8">
              <Link href="/[...url]" as={`/${example}`}>
                <a className="text-blue-500">https://{example}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Home;
