import Link from "next/link";
import { DocNode, groupNodes, DocNodeShared } from "../util/docs";

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
        {props.nodes.map(node => (
          <p>
            <Link href={`/${props.type}/${node.name}`}>
              <a className="text-blue-500">{node.name}</a>
            </Link>
          </p>
        ))}
      </div>
    </div>
  ) : null;
};

export const Sidebar = (props: { docs: DocNode[]; generationDate: Date }) => {
  const groups = groupNodes(props.docs);

  return (
    <>
      <header className="px-6 py-4 border-b border-gray-200">
        <div className="text-gray-900 text-md">deno_doc</div>
        <div className="text-gray-600 text-sm">
          Generated on {props.generationDate.toLocaleDateString()}
        </div>
      </header>
      <nav className="px-6 py-2">
        <SidebarSection title="Classses" type="class" nodes={groups.classes} />
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
        <SidebarSection title="Enums" type="enum" nodes={groups.enums} />
        <SidebarSection
          title="Interfaces"
          type="interface"
          nodes={groups.interfaces}
        />
        <SidebarSection
          title="Type Aliases"
          type="typealias"
          nodes={groups.typeAliases}
        />
        <SidebarSection
          title="Namespaces"
          type="namespace"
          nodes={groups.namespaces}
        />
      </nav>
    </>
  );
};
