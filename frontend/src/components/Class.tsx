import React from "react";
import { Page } from "./Page";
import {
  DocNodeClass,
  ClassConstructorDef,
  ClassPropertyDef,
  ClassMethodDef
} from "../util/docs";
import { FunctionLink } from "./Function";
import { VariableLink } from "./Variable";
import { JSDoc, CodeBlock } from "./JSDoc";
import { SimpleCard, SimpleSubCard } from "./SinglePage";

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
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {class_.name} class
          </div>
          {class_.classDef.isAbstract ? (
            <p className="text-gray-500 italic font-light mb-1">abstract</p>
          ) : null}
          {class_.jsDoc ? <JSDoc jsdoc={class_.jsDoc} /> : null}
        </div>
        {constructors.length > 0 ? (
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Constructors
            </div>
            <div>
              {constructors.map(node => (
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="constructor"
                  params={node.params}
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
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="method"
                  params={node.functionDef?.params}
                  returnType={node.functionDef?.returnType}
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
                <FunctionLink
                  key={node.name}
                  name={node.name}
                  jsDoc={node.jsDoc}
                  type="method"
                  params={node.functionDef?.params}
                  returnType={node.functionDef?.returnType}
                  accessibility={node.accessibility}
                  isAbstract={node.isAbstract}
                />
              ))}
            </div>
          </div>
        ) : null}
        <div className="text-sm">
          Defined in {class_.location.filename}:{class_.location.line}:
          {class_.location.col}
        </div>
      </div>
    </Page>
  );
};

export const ClassConstructor = ({
  constructor_
}: {
  constructor_: ClassConstructorDef;
}) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {constructor_.name} constructor
          </div>
          <div className="py-1">
            {constructor_.name}
            <span className="text-gray-600 font-light">
              (
              {constructor_.params
                .map(p => `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`)
                .join(", ")}
              )
            </span>
          </div>
          {constructor_.jsDoc ? <JSDoc jsdoc={constructor_.jsDoc} /> : null}
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Implementation
            </div>
            <CodeBlock value={constructor_.snippet} />
          </div>
        </div>
        <div className="text-sm">
          Defined in {constructor_.location.filename}:
          {constructor_.location.line}:{constructor_.location.col}
        </div>
      </div>
    </Page>
  );
};

export const ClassProperty = ({ property }: { property: ClassPropertyDef }) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {property.name} {property.isStatic ? "static" : ""} property
          </div>
          <div className="py-1">
            {property.name}
            {property.tsType?.repr ? (
              <span className="text-gray-600 font-light">
                {" → "}
                {property.tsType?.repr}
              </span>
            ) : null}
            <p className="text-gray-500 italic font-light">
              {([] as string[])
                .concat(
                  ...(property.accessibility === "private" ? ["private"] : [])
                )
                .concat(
                  ...(property.accessibility === "protected"
                    ? ["protected"]
                    : [])
                )
                .concat(...(property.isAbstract ? ["abstract"] : []))
                .concat(property.readonly ? "read-only" : "read / write")
                .join(", ")}
            </p>
          </div>
          {property.jsDoc ? <JSDoc jsdoc={property.jsDoc} /> : null}
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Implementation
            </div>
            <CodeBlock value={property.snippet} />
          </div>{" "}
        </div>
        <div className="text-sm">
          Defined in {property.location.filename}:{property.location.line}:
          {property.location.col}
        </div>
      </div>
    </Page>
  );
};

export const ClassMethod = ({ method }: { method: ClassMethodDef }) => {
  return (
    <Page mode="multipage">
      <div className="p-8 pt-4">
        <div className="pb-4">
          <div className="text-gray-900 text-3xl font-medium">
            {method.name} {method.isStatic ? "static" : ""} method
          </div>
          <div className="py-1">
            {method.name}
            <span className="text-gray-600 font-light">
              (
              {method.functionDef?.params
                .map(p => `${p.name}${p.tsType ? ": " + p.tsType.repr : ""}`)
                .join(", ")}
              )
            </span>
            {method.functionDef?.returnType?.repr ? (
              <>
                <span className="text-gray-600 font-light">
                  {" → "}
                  {method.functionDef?.returnType?.repr}
                </span>
              </>
            ) : null}
          </div>
          <p className="text-gray-500 italic font-light">
            {([] as string[])
              .concat(
                ...(method.accessibility === "private" ? ["private"] : [])
              )
              .concat(
                ...(method.accessibility === "protected" ? ["protected"] : [])
              )
              .concat(...(method.isAbstract ? ["abstract"] : []))
              .join(", ")}
          </p>
          {method.jsDoc ? <JSDoc jsdoc={method.jsDoc} /> : null}
          <div className="py-4">
            <div className="text-gray-900 text-2xl font-medium mb-1">
              Implementation
            </div>
            <CodeBlock value={method.snippet} />
          </div>
        </div>
        <div className="text-sm">
          Defined in {method.location.filename}:{method.location.line}:
          {method.location.col}
        </div>
      </div>
    </Page>
  );
};

export function ClassCard({ node }: { node: DocNodeClass }) {
  const constructors = node.classDef.constructors;
  const properties = node.classDef.properties.filter(
    node => node.accessibility !== "private"
  );
  const realProperties = properties.filter(node => !node.isStatic);
  const staticProperties = properties.filter(node => node.isStatic);
  const methods = node.classDef.methods.filter(
    node => node.accessibility !== "private"
  );
  const realMethods = methods.filter(node => !node.isStatic);
  const staticMethods = methods.filter(node => node.isStatic);

  return (
    <SimpleCard
      node={node}
      details={
        <>
          {constructors.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Constructors</p>
              {constructors.map(node => {
                return <SimpleSubCard node={node} params={node.params} />;
              })}
            </div>
          ) : null}
          {realProperties.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Properties</p>
              {realProperties.map(node => {
                return <SimpleSubCard node={node} returnType={node.tsType} />;
              })}
            </div>
          ) : null}
          {realMethods.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Methods</p>
              {realMethods.map(node => {
                return (
                  <SimpleSubCard
                    node={node}
                    params={node.functionDef.params}
                    returnType={node.functionDef.returnType}
                  />
                );
              })}
            </div>
          ) : null}
          {staticProperties.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Static Properties</p>
              {realProperties.map(node => {
                return <SimpleSubCard node={node} returnType={node.tsType} />;
              })}
            </div>
          ) : null}
          {staticMethods.length > 0 ? (
            <div className="mt-2">
              <p className="text-md font-medium">Static Methods</p>
              {realMethods.map(node => {
                return (
                  <SimpleSubCard
                    node={node}
                    params={node.functionDef.params}
                    returnType={node.functionDef.returnType}
                  />
                );
              })}
            </div>
          ) : null}
        </>
      }
    />
  );
}
