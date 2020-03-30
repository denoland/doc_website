import React from "react";
import { Sidebar } from "./Sidebar";

export function Page(props: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1 max-h-screen overflow-y-scroll">
        <Sidebar />
      </div>
      <div className="col-span-4 bg-gray-100 max-h-screen overflow-y-scroll">
        {props.children}
      </div>
    </div>
  );
}
