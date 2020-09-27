// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import { DocNodeShared, GroupedNodes } from "../util/docs";

const SidebarSection = (props: {
  title: string;
  type: string;
  nodes: DocNodeShared[];
}) => {
  return props.nodes.length > 0 ? (
    <div className="mt-2 mb-4">
      <div className="mb-1 text-lg text-gray-900 dark:text-gray-200 font-bold">
        {props.title}
      </div>
      <div>
        {props.nodes.map((node, i) => {
          const scope = node.scope ? node.scope.join(".") + "." : "";
          return (
            <p
              key={node.name + "+" + i}
              className="text-gray-800 dark:text-gray-300"
            >
              {scope}
              <a className="link" href={`#${scope}${node.name}`}>
                {node.name}
              </a>
            </p>
          );
        })}
      </div>
    </div>
  ) : null;
};

export const Sidebar = ({ groups }: { groups: GroupedNodes }) => {
  return (
    <div className="pt-2 pb-8 h-0 flex-1 flex flex-col overflow-y-auto">
      <nav className="flex-1 px-4">
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
    </div>
  );
};
