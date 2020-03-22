import Head from "next/head";
import { useState, useEffect } from "react";
import { DocNode, getDocs } from "../util/docs";
import { Sidebar } from "../components/Sidebar";

const Home = () => {
  const [docs, setDocs] = useState<DocNode[]>(null);

  useEffect(() => {
    getDocs().then(setDocs);
  }, []);

  return (
    <>
      <Head>
        <title>deno_doc</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {docs ? (
        <div className="grid grid-cols-5 h-full w-full">
          <div className="col-span-1">
            <Sidebar docs={docs} generationDate={new Date()} />
          </div>
          <div className="col-span-4 bg-gray-100"></div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <div className="text-gray-800 text-2xl">Loading...</div>
        </div>
      )}
    </>
  );
};

export default Home;
