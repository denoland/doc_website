import Head from "next/head";
import { useState, useEffect } from "react";
import { DocNode, getDocs } from "../util/docs";
import { Sidebar } from "../components/Sidebar";
import { Namespace } from "../components/Namespace";

const Home = () => {
  const [nodes, setNodes] = useState<DocNode[]>(null);

  useEffect(() => {
    getDocs().then(setNodes);
  }, []);

  return (
    <>
      <Head>
        <title>deno_doc</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {nodes ? (
        <div className="grid grid-cols-5 h-full w-full">
          <div className="col-span-1">
            <Sidebar nodes={nodes} generationDate={new Date()} />
          </div>
          <div className="col-span-4 bg-gray-100">
            <Namespace nodes={nodes} name="Module" />
          </div>
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
