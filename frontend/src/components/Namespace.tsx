import React from "react";
import { Link } from "./Link";
import { Page } from "./Page";
import { groupNodes, cleanJSDoc, DocNodeNamespace } from "../util/docs";

export const Namespace = (props: {
  namespace: DocNodeNamespace;
  isRootNamespace?: boolean;
}) => {
  const groups = groupNodes(props.namespace.namespaceDef.elements);

  return (
    <Page namespacesOnlySidebar>
      <div className="p-8">
        <div className="text-gray-900 text-3xl font-medium">
          {props.namespace.name}
        </div>
        {props.namespace.jsDoc ? (
          <p className="text-gray-700">{cleanJSDoc(props.namespace.jsDoc)}</p>
        ) : null}

        {groups.classes.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Classes
            </div>
            <div>
              {groups.classes.map(node => (
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                  {node.classDef.isAbstract ? (
                    <p className="text-gray-500 italic font-light">abstract</p>
                  ) : null}
                </div>
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
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>{" "}
                    {node.variableDef?.type_.repr ? (
                      <>
                        <span className="text-gray-600 font-light">
                          → {node.variableDef?.type_.repr}
                        </span>
                      </>
                    ) : null}
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                  {node.variableDef?.kind ? (
                    <p className="text-gray-500 italic font-light">
                      {node.variableDef.kind}
                    </p>
                  ) : null}
                </div>
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
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                    <span className="text-gray-600 font-light">
                      (
                      {node.functionDef.params
                        .map(
                          p =>
                            `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`
                        )
                        .join(", ")}
                      )
                    </span>
                    {node.functionDef?.returnType?.repr ? (
                      <>
                        <span className="text-gray-600 font-light">
                          → {node.functionDef.returnType.repr}
                        </span>
                      </>
                    ) : null}
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {groups.enums.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">Enums</div>
            <div>
              {groups.enums.map(node => (
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                </div>
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
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                </div>
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
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                </div>
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
                <div className="py-2" key={node.name}>
                  <p>
                    <Link
                      to={`/${node.kind}/${node.name}`}
                      className="text-blue-500"
                    >
                      {node.name}
                    </Link>
                  </p>
                  {node.jsDoc ? (
                    <p className="text-gray-700">{cleanJSDoc(node.jsDoc)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
};
