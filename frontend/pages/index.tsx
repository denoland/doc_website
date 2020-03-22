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

      {docs ? <>{docs.length}</> : <div>Loading...</div>}
    </>
  );
};

export default Home;
