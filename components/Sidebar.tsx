import React, { useMemo } from "react";
import Link from "next/link";
import { groupNodes, DocNodeShared, sortByAlphabet } from "../util/docs";
import { useFlattend } from "../util/data";

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
        {props.nodes.map((node, i) => {
          const scope = node.scope ? node.scope.join(".") + "." : "";
          return (
            <p key={node.name + "+" + i}>
              {scope}
              <Link href="/https/[...url]" as={`#${scope}${node.name}`}>
                <a className="text-blue-600">{node.name}</a>
              </Link>
            </p>
          );
        })}
      </div>
    </div>
  ) : null;
};

export const Sidebar = (props: {
  forceReload: () => void;
  entrypoint: string;
  timestamp: string;
}) => {
  const flattend = useFlattend();
  const nodes = useMemo(() => sortByAlphabet(flattend), [flattend]);
  const groups = useMemo(() => groupNodes(nodes), [nodes]);

  return (
    <>
      {flattend ? (
        <header className="px-4 sm:px-6 pt-3 sm:pt-4">
          <a
            className="text-blue-600 text-sm cursor-pointer break-words"
            href={props.entrypoint}
          >
            {props.entrypoint}
          </a>
          <div className="text-gray-900 text-xl font-bold mt-3 lg:hidden">
            Table of Contents
          </div>
          <div className="text-gray-600 text-sm mt-2">
            Last refreshed {new Date(props.timestamp).toLocaleString()}.{" "}
            <a
              className="text-blue-600 text-sm cursor-pointer"
              onClick={props.forceReload}
            >
              Refresh now
            </a>
          </div>
        </header>
      ) : null}
      <nav className="px-4 sm:px-6 py-2">
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
