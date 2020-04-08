// Copyright 2020 the Deno authors. All rights reserved. MIT license.

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
      <div className="mb-1 text-xl font-medium text-gray-900">
        {props.title}
      </div>
      <div>
        {props.nodes.map((node, i) => {
          const scope = node.scope ? node.scope.join(".") + "." : "";
          return (
            <p key={node.name + "+" + i}>
              {scope}
              <Link href="/https/[...url]" as={`#${scope}${node.name}`}>
                <a className="link">{node.name}</a>
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
        <header className="px-4 pt-3 sm:px-6 sm:pt-4">
          <div className="text-xl font-bold text-gray-900 lg:hidden">
            Table of Contents
          </div>
          {props.timestamp ? (
            <div className="mt-1 text-sm text-gray-600">
              Last refreshed {new Date(props.timestamp).toLocaleString()}.{" "}
              <a
                className="text-sm cursor-pointer link"
                onClick={props.forceReload}
              >
                Refresh now
              </a>
            </div>
          ) : null}
        </header>
      ) : null}
      <nav className="px-4 py-2 sm:px-6">
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
