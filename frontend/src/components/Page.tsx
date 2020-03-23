import React from "react";
import { Sidebar } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

export function Page(props: {
  children: React.ReactNode;
  namespacesOnlySidebar?: boolean;
  mode: "singlepage" | "multipage";
}) {
  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1 max-h-screen overflow-y-scroll">
        <Sidebar
          mode={props.mode}
          generationDate={new Date()}
          namespacesOnly={props.namespacesOnlySidebar}
        />
      </div>
      <div className="col-span-4 bg-gray-100 max-h-screen overflow-y-scroll">
        <Breadcrumbs />
        {props.children}
      </div>
    </div>
  );
}
