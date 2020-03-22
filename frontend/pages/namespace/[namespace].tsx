import Head from "next/head";
import { useState, useEffect } from "react";
import {
  DocNode,
  getDocs,
  DocNodeKind,
  DocNodeNamespace
} from "../../util/docs";
import { Sidebar } from "../../components/Sidebar";
import { Namespace } from "../../components/Namespace";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  const [nodes, setNodes] = useState<DocNode[]>(null);

  useEffect(() => {
    getDocs().then(setNodes);
  }, []);

  const namespaceName = router.query.namespace;
  const namespace = (nodes?.find(
    node => node.kind === DocNodeKind.Namespace && node.name === namespaceName
  ) as any) as DocNodeNamespace;

  return (
    <>
      <Head>
        <title>deno_doc</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {nodes ? (
        namespace ? (
          <div className="grid grid-cols-5 h-full w-full">
            <div className="col-span-1">
              <Sidebar
                nodes={namespace.namespaceDef.elements}
                generationDate={new Date()}
              />
            </div>
            <div className="col-span-4 bg-gray-100">
              <Namespace
                nodes={namespace.namespaceDef.elements}
                name="Module"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <div className="text-gray-800 text-2xl">
              Could not find namespace {namespaceName}.
            </div>
          </div>
        )
      ) : (
        <div className="h-full flex justify-center items-center">
          <div className="text-gray-800 text-2xl">Loading...</div>
        </div>
      )}
    </>
  );
};

export default Home;
