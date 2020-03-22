import Head from "next/head";
import { useState, useEffect } from "react";
import { DocNode, getDocs } from "../util/docs";

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
        <div className="text-gray-900 text-3xl">{docs.length}</div>
      ) : (
        <div className="text-gray-600 text-lg">Loading...</div>
      )}
    </>
  );
};

export default Home;
