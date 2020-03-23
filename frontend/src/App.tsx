import React, { useState, useEffect } from "react";
import { DocNode, getDocs } from "./util/docs";
import { NodesProvider } from "./util/nodes";
import { NamespaceRoute } from "./routes/namespace";
import { PrefixProvider } from "./util/prefix";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const [nodes, setNodes] = useState<DocNode[] | null>(null);

  useEffect(() => {
    getDocs().then(setNodes);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return nodes ? (
    <NodesProvider value={nodes}>
      <PrefixProvider value={{ namespace: "", node: "" }}>
        <NamespaceRoute name="" />
      </PrefixProvider>
    </NodesProvider>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">Loading...</div>
    </div>
  );
}

export default App;
