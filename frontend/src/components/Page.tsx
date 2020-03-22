import React from "react";
import { Sidebar } from "./Sidebar";

export function Page(props: {
  children: React.ReactElement;
  namespacesOnlySidebar?: boolean;
}) {
  return (
    <div className="grid grid-cols-5 h-full w-full">
      <div className="col-span-1">
        <Sidebar
          generationDate={new Date()}
          namespacesOnly={props.namespacesOnlySidebar}
        />
      </div>
      <div className="col-span-4 bg-gray-100">{props.children}</div>
    </div>
  );
}
