import React, { useState, useEffect } from "react";
import { DocNode, getDocs } from "./util/docs";
import { Switch, Route, useLocation } from "react-router-dom";
import { SinglePageRoute } from "./routes/singlepage";
import { NotFound } from "./components/NotFound";

function App() {
  const { pathname } = useLocation();
  const [nodes, setNodes] = useState<DocNode[] | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const entrypoint = pathname.slice(1);

  useEffect(() => {
    if (entrypoint)
      getDocs(entrypoint)
        .then(setNodes)
        .catch(err => setError(err?.message ?? err));
  }, [entrypoint]);

  return error ? (
    <div className="h-full flex justify-center items-center flex-col">
      <div className="text-gray-800 text-2xl">
        An error occured while loading the documentation.
      </div>
      <div className="text-lg mt-2">{error}</div>
    </div>
  ) : !entrypoint ? (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">No entrypoint supplied.</div>
    </div>
  ) : nodes ? (
    <Switch>
      <Route path="/">
        <SinglePageRoute nodes={nodes} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">Loading...</div>
    </div>
  );
}

export default App;
