import React from "react";
import { Link } from "./Link";
import { groupNodes, DocNodeShared } from "../util/docs";
import { useNodes } from "../util/nodes";

const SidebarSection = (props: {
  title: string;
  type: string;
  nodes: DocNodeShared[];
  mode: "singlepage" | "multipage";
}) => {
  return props.nodes.length > 0 ? (
    <div className="py-4">
      <div className="text-gray-900 text-xl font-medium mb-1">
        {props.title}
      </div>
      <div>
        {props.nodes.map((node, i) => (
          <p key={node.name + "+" + i}>
            {props.mode === "singlepage" ? (
              <a href={`#${props.type}.${node.name}`} className="text-blue-500">
                {node.name}
              </a>
            ) : (
              <Link
                href={`/${props.type}/${node.name}`}
                className="text-blue-500"
              >
                {node.name}
              </Link>
            )}
          </p>
        ))}
      </div>
    </div>
  ) : null;
};

export const Sidebar = (props: {
  generationDate: Date;
  namespacesOnly?: boolean;
  mode: "singlepage" | "multipage";
}) => {
  const nodes = useNodes();
  const groups = groupNodes(nodes);
  return (
    <>
      <header className="px-6 py-4 border-b border-gray-200">
        <div className="text-gray-900 text-md">deno_doc</div>
        <div className="text-gray-600 text-sm">
          Generated on {props.generationDate.toLocaleDateString()}
        </div>
      </header>
      <nav className="px-6 py-2">
        {!props.namespacesOnly ? (
          <>
            <SidebarSection
              title="Classes"
              type="class"
              nodes={groups.classes}
              mode={props.mode}
            />
            <SidebarSection
              title="Variables"
              type="variable"
              nodes={groups.variables}
              mode={props.mode}
            />
            <SidebarSection
              title="Functions"
              type="function"
              nodes={groups.functions}
              mode={props.mode}
            />
            <SidebarSection
              title="Enums"
              type="enum"
              nodes={groups.enums}
              mode={props.mode}
            />
            <SidebarSection
              title="Interfaces"
              type="interface"
              nodes={groups.interfaces}
              mode={props.mode}
            />
            <SidebarSection
              title="Type Aliases"
              type="typeAlias"
              nodes={groups.typeAliases}
              mode={props.mode}
            />
          </>
        ) : null}
        <SidebarSection
          title="Namespaces"
          type="namespace"
          nodes={groups.namespaces}
          mode={props.mode}
        />
      </nav>
    </>
  );
};
