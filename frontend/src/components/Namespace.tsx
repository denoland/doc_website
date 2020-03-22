import React from "react";
import { Page } from "./Page";
import { groupNodes, cleanJSDoc, DocNodeNamespace } from "../util/docs";
import { FunctionLink } from "./Function";
import { VariableLink } from "./Variable";
import { SimpleLink } from "./SimpleLink";

export const Namespace = (props: {
  namespace: DocNodeNamespace;
  isRootNamespace?: boolean;
}) => {
  const groups = groupNodes(props.namespace.namespaceDef.elements);

  return (
    <Page namespacesOnlySidebar>
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {props.namespace.name} namespace
          </div>
          {props.namespace.jsDoc ? (
            <p className="text-gray-700">{cleanJSDoc(props.namespace.jsDoc)}</p>
          ) : null}
        </div>
        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <div>
              {groups.classes.map(node => (
                <SimpleLink name={node.name} type="class" jsDoc={node.jsDoc} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.variables.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Variables
            </div>
            <div>
              {groups.variables.map(node => (
                <VariableLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="variable"
                  returnType={node.variableDef?.type_}
                  readonly={node.variableDef?.kind === "const"}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.functions.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Functions
            </div>
            <div>
              {groups.functions.map(node => (
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="function"
                  params={node.functionDef.params}
                  returnType={node.functionDef.returnType}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map(node => (
                <SimpleLink name={node.name} type="enum" jsDoc={node.jsDoc} />
              ))}
            </div>
          </div>
        ) : null}
        {groups.interfaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Interfaces
            </div>
            <div>
              {groups.interfaces.map(node => (
                <SimpleLink
                  name={node.name}
                  type="interface"
                  jsDoc={node.jsDoc}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.typeAliases.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Type Aliases
            </div>
            <div>
              {groups.typeAliases.map(node => (
                <SimpleLink
                  name={node.name}
                  type="typealias"
                  jsDoc={node.jsDoc}
                />
              ))}
            </div>
          </div>
        ) : null}
        {groups.namespaces.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Namespaces
            </div>
            <div>
              {groups.namespaces.map(node => (
                <SimpleLink
                  name={node.name}
                  type="namespace"
                  jsDoc={node.jsDoc}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
};
