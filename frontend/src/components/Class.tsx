import React from "react";
import { Page } from "./Page";
import { cleanJSDoc, DocNodeClass } from "../util/docs";
import { FunctionLink } from "./Function";
import { VariableLink } from "./Variable";

export const Class = ({ class: class_ }: { class: DocNodeClass }) => {
  const constructors = class_.classDef.constructors;
  const properties = class_.classDef.properties.filter(
    node => node.accessibility !== "private"
  );
  const realProperties = properties.filter(node => !node.isStatic);
  const staticProperties = properties.filter(node => node.isStatic);
  const methods = class_.classDef.methods.filter(
    node => node.accessibility !== "private"
  );
  const realMethods = methods.filter(node => !node.isStatic);
  const staticMethods = methods.filter(node => node.isStatic);

  return (
    <Page>
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {class_.name} class
          </div>
          {class_.classDef.isAbstract ? (
            <p className="text-gray-500 italic font-light mb-1">abstract</p>
          ) : null}
          {class_.jsDoc ? (
            <p className="text-gray-700">{cleanJSDoc(class_.jsDoc)}</p>
          ) : null}
        </div>
        {constructors.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Constructors
            </div>
            <div>
              {constructors.map(node => (
                // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="constructor"
                  params={[]}
                  accessibility={node.accessibility}
                />
              ))}
            </div>
          </div>
        ) : null}
        {realProperties.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Properties
            </div>
            <div>
              {realProperties.map(node => (
                <VariableLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="property"
                  returnType={node.tsType}
                  accessibility={node.accessibility}
                  readonly={node.readonly}
                  isAbstract={node.isAbstract}
                />
              ))}
            </div>
          </div>
        ) : null}
        {realMethods.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Methods
            </div>
            <div>
              {realMethods.map(node => (
                // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="method"
                  params={[]}
                  accessibility={node.accessibility}
                  isAbstract={node.isAbstract}
                />
              ))}
            </div>
          </div>
        ) : null}
        {staticProperties.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Static Properties
            </div>
            <div>
              {staticProperties.map(node => (
                <VariableLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="property"
                  returnType={node.tsType}
                  accessibility={node.accessibility}
                  readonly={node.readonly}
                  isAbstract={node.isAbstract}
                />
              ))}
            </div>
          </div>
        ) : null}
        {staticMethods.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Static Methods
            </div>
            <div>
              {staticMethods.map(node => (
                // TODO(lucacasonato): https://github.com/bartlomieju/deno_doc/issues/4
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="method"
                  params={[]}
                  accessibility={node.accessibility}
                  isAbstract={node.isAbstract}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Page>
  );
};
