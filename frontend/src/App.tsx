import React, { useState, useEffect } from "react";
import { getData, DataResponse } from "./util/docs";
import { useLocation } from "react-router-dom";
import { SinglePageRoute } from "./routes/singlepage";

function App() {
  const { pathname } = useLocation();
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const entrypoint = pathname.slice(1);

  useEffect(() => {
    if (entrypoint)
      getData(entrypoint)
        .then(setData)
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
  ) : data ? (
    <SinglePageRoute data={data} />
  ) : (
    <div className="h-full flex justify-center items-center">
      <div className="text-gray-800 text-2xl">Loading...</div>
    </div>
  );
}

export default App;
