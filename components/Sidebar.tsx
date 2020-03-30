import React, { useMemo } from "react";
import Link from "next/link";
import { groupNodes, DocNodeShared } from "../util/docs";
import { useData } from "../util/data";

const SidebarSection = (props: {
  title: string;
  type: string;
  nodes: DocNodeShared[];
}) => {
  return props.nodes.length > 0 ? (
    <div className="py-4">
      <div className="text-gray-900 text-xl font-medium mb-1">
        {props.title}
      </div>
      <div>
        {props.nodes.map((node, i) => (
          <p key={node.name + "+" + i}>
            <Link href={`#${props.type}.${node.name}`}>
              <a className="text-blue-500">{node.name}</a>
            </Link>
          </p>
        ))}
      </div>
    </div>
  ) : null;
};

export const Sidebar = (props: {}) => {
  const { nodes, timestamp } = useData();
  const groups = useMemo(() => groupNodes(nodes), [nodes]);

  return (
    <>
      <header className="px-6 pt-4">
        <div className="text-gray-900 text-xl font-bold mb-2 lg:hidden">
          Table of Contents
        </div>
        <div className="text-gray-600 text-sm">
          Last updated {new Date(timestamp).toLocaleString()}
        </div>
        {/*<div className="flex">
          <div className="mt-1 relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">
                https://
              </span>
            </div>
            <input
              className="bg-white border rounded text-gray-800 block w-full py-2 pr-2 sm:text-sm sm:leading-5 outline-none shadow-sm focus:shadow"
              style={{ paddingLeft: "3.75rem" }}
              placeholder="deno.land/std/http/server.ts"
              value={url}
              onChange={t => setUrl(t.target.value)}
            />
          </div>
          <button
            className="ml-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              history.push("/" + url);
            }}
          >
            Go
          </button>
        </div>*/}
      </header>
      <nav className="px-6 py-2">
        <>
          <SidebarSection
            title="Functions"
            type="function"
            nodes={groups.functions}
          />
          <SidebarSection
            title="Variables"
            type="variable"
            nodes={groups.variables}
          />
          <SidebarSection title="Classes" type="class" nodes={groups.classes} />
          <SidebarSection title="Enums" type="enum" nodes={groups.enums} />
          <SidebarSection
            title="Interfaces"
            type="interface"
            nodes={groups.interfaces}
          />
          <SidebarSection
            title="Type Aliases"
            type="typeAlias"
            nodes={groups.typeAliases}
          />
        </>
        <SidebarSection
          title="Namespaces"
          type="namespace"
          nodes={groups.namespaces}
        />
      </nav>
    </>
  );
};
