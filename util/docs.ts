// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { schoolBook } from "react-syntax-highlighter/dist/esm/styles/hljs";

export enum DocNodeKind {
  Function = "function",
  Variable = "variable",
  Class = "class",
  Enum = "enum",
  Interface = "interface",
  TypeAlias = "typeAlias",
  Namespace = "namespace",
  Import = "import",
}
export interface DocNodeLocation {
  filename: string;
  line: number;
  col: number;
}
export interface DocNodeShared {
  name: string;
  scope?: string[];
  location: DocNodeLocation;
  jsDoc?: string;
}
export interface TsTypeParamDef {
  name: string;
  constraint?: TsTypeDef;
  default?: TsTypeDef;
}
export interface TsTypeRefDef {
  typeName: string;
  typeParams?: TsTypeDef[];
}
export interface TsTypeOperatorDef {
  operator: string;
  tsType: TsTypeDef;
}
export interface TsFnOrConstructorDef {
  constructor: boolean;
  tsType: TsTypeDef;
  params: ParamDef[];
}
export interface TsConditionalDef {
  checkType: TsTypeDef;
  extendsType: TsTypeDef;
  trueType: TsTypeDef;
  falseType: TsTypeDef;
}
export interface TsIndexedAccessDef {
  readonly: boolean;
  objType: TsTypeDef;
  indexType: TsTypeDef;
}
export interface TsTypeLiteralDef {
  methods: LiteralMethodDef[];
  properties: LiteralPropertyDef[];
  callSignatures: LiteralCallSignatureDef[];
  indexSignatures: LiteralIndexSignatureDef[];
}
export interface LiteralMethodDef {
  name: string;
  params: ParamDef[];
  returnType?: TsTypeDef;
}
export interface LiteralPropertyDef {
  name: string;
  computed: boolean;
  optional: boolean;
  tsType?: TsTypeDef;
}
export interface LiteralCallSignatureDef {
  params: ParamDef[];
  tsType?: TsTypeDef;
}
export interface LiteralIndexSignatureDef {
  readonly: boolean;
  params: ParamDef[];
  tsType?: TsTypeDef;
}
export interface LiteralMethodDef {
  params: ParamDef[];
  returnType?: TsTypeDef;
}
export enum LiteralDefKind {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}
export type LiteralDef =
  | {
    kind: LiteralDefKind.Number;
    number: number;
  }
  | {
    kind: LiteralDefKind.String;
    string: string;
  }
  | {
    kind: LiteralDefKind.Boolean;
    boolean: boolean;
  };
export enum TsTypeDefKind {
  Keyword = "keyword",
  Literal = "literal",
  TypeRef = "typeRef",
  Union = "union",
  Intersection = "intersection",
  Array = "array",
  Tuple = "tuple",
  TypeOperator = "typeOperator",
  Parenthesized = "parenthesized",
  Rest = "rest",
  Optional = "optional",
  TypeQuery = "typeQuery",
  This = "this",
  FnOrConstructor = "fnOrConstructor",
  Conditional = "conditional",
  IndexedAccess = "indexedAccess",
  TypeLiteral = "typeLiteral",
}
export interface TsTypeDefShared {
  repr: string;
}
export interface TsTypeDefArray extends TsTypeDefShared {
  kind: TsTypeDefKind.Array;
  array: TsTypeDef;
}
export interface TsTypeDefConditional extends TsTypeDefShared {
  kind: TsTypeDefKind.Conditional;
  conditionalType: TsConditionalDef;
}
export interface TsTypeDefFnOrConstructor extends TsTypeDefShared {
  kind: TsTypeDefKind.FnOrConstructor;
  fnOrConstructor: TsFnOrConstructorDef;
}
export interface TsTypeDefIndexedAccess extends TsTypeDefShared {
  kind: TsTypeDefKind.IndexedAccess;
  indexedAccess: TsIndexedAccessDef;
}
export interface TsTypeDefIntersection extends TsTypeDefShared {
  kind: TsTypeDefKind.Intersection;
  intersection: TsTypeDef[];
}
export interface TsTypeDefKeyword extends TsTypeDefShared {
  kind: TsTypeDefKind.Keyword;
  keyword: string;
}
export interface TsTypeDefLiteral extends TsTypeDefShared {
  kind: TsTypeDefKind.Literal;
  literal: LiteralDef;
}
export interface TsTypeDefOptional extends TsTypeDefShared {
  kind: TsTypeDefKind.Optional;
  optional: TsTypeDef;
}
export interface TsTypeDefParenthesized extends TsTypeDefShared {
  kind: TsTypeDefKind.Parenthesized;
  parenthesized: TsTypeDef;
}
export interface TsTypeDefRest extends TsTypeDefShared {
  kind: TsTypeDefKind.Rest;
  rest: TsTypeDef;
}
export interface TsTypeDefThis extends TsTypeDefShared {
  kind: TsTypeDefKind.This;
  this: boolean;
}
export interface TsTypeDefTuple extends TsTypeDefShared {
  kind: TsTypeDefKind.Tuple;
  tuple: TsTypeDef[];
}
export interface TsTypeDefTypeLiteral extends TsTypeDefShared {
  kind: TsTypeDefKind.TypeLiteral;
  typeLiteral: TsTypeLiteralDef;
}
export interface TsTypeDefTypeOperator extends TsTypeDefShared {
  kind: TsTypeDefKind.TypeOperator;
  typeOperator: TsTypeOperatorDef;
}
export interface TsTypeDefTypeQuery extends TsTypeDefShared {
  kind: TsTypeDefKind.TypeQuery;
  typeQuery: string;
}
export interface TsTypeDefTypeRef extends TsTypeDefShared {
  kind: TsTypeDefKind.TypeRef;
  typeRef: TsTypeRefDef;
}
export interface TsTypeDefUnion extends TsTypeDefShared {
  kind: TsTypeDefKind.Union;
  union: TsTypeDef[];
}
export type TsTypeDef =
  | TsTypeDefArray
  | TsTypeDefConditional
  | TsTypeDefFnOrConstructor
  | TsTypeDefIndexedAccess
  | TsTypeDefIntersection
  | TsTypeDefKeyword
  | TsTypeDefLiteral
  | TsTypeDefOptional
  | TsTypeDefParenthesized
  | TsTypeDefRest
  | TsTypeDefThis
  | TsTypeDefTuple
  | TsTypeDefTypeLiteral
  | TsTypeDefTypeOperator
  | TsTypeDefTypeQuery
  | TsTypeDefTypeRef
  | TsTypeDefUnion;

export type ParamDef =
  | {
    kind: "array";
    elements: (ParamDef | null)[];
    optional: boolean;
    tsType?: TsTypeDef;
  }
  | {
    kind: "assign";
    left: ParamDef;
    right: string;
    tsType?: TsTypeDef;
  }
  | {
    kind: "identifier";
    name: string;
    optional: boolean;
    tsType?: TsTypeDef;
  }
  | {
    kind: "object";
    props: ObjectPatPropDef[];
    optional: boolean;
    tsType?: TsTypeDef;
  }
  | {
    kind: "rest";
    arg: ParamDef;
    tsType?: TsTypeDef;
  };
export type ObjectPatPropDef =
  | {
    kind: "assign";
    key: string;
    value?: string;
  }
  | {
    kind: "keyValue";
    key: string;
    value: ParamDef;
  }
  | {
    kind: "rest";
    arg: ParamDef;
  };
export interface FunctionDef {
  params: ParamDef[];
  returnType?: TsTypeDef;
  isAsync: boolean;
  isGenerator: boolean;
}
export interface VariableDef {
  tsType: TsTypeDef;
  kind: "var" | "let" | "const";
}
export type Accessibility = "public" | "protected" | "private";
export interface ClassConstructorDef extends DocNodeShared {
  accessibility?: Accessibility;
  params: ParamDef[];
}
export interface ClassPropertyDef extends DocNodeShared {
  tsType: TsTypeDef;
  readonly: boolean;
  accessibility?: Accessibility;
  optional: boolean;
  isAbstract: boolean;
  isStatic: boolean;
}
export interface ClassMethodDef extends DocNodeShared {
  accessibility?: Accessibility;
  optional: boolean;
  isAbstract: boolean;
  isStatic: boolean;
  kind: "method" | "getter" | "setter";
  functionDef: FunctionDef;
}
export interface ClassDef {
  isAbstract: boolean;
  constructors: ClassConstructorDef[];
  properties: ClassPropertyDef[];
  indexSignatures: ClassIndexSignatureDef[];
  methods: ClassMethodDef[];
  extends?: string;
  implements: TsTypeDef[];
  typeParams: TsTypeParamDef[];
  superTypeParams: TsTypeDef[];
}
export interface ClassIndexSignatureDef {
  readonly: boolean;
  params: ParamDef[];
  tsType?: TsTypeDef;
}
export interface EnumMemberDef {
  name: string;
}
export interface EnumDef {
  members: EnumMemberDef[];
}

export interface InterfaceMethodDef extends DocNodeShared {
  params: ParamDef[];
  optional: boolean;
  returnType?: TsTypeDef;
}

export interface InterfacePropertyDef extends DocNodeShared {
  computed: boolean;
  optional: boolean;
  tsType?: TsTypeDef;
}

export interface InterfaceCallSignatureDef extends Omit<DocNodeShared, "name"> {
  params: ParamDef[];
  tsType?: TsTypeDef;
}

export interface InterfaceDef {
  extends: TsTypeDef[];
  methods: InterfaceMethodDef[];
  properties: InterfacePropertyDef[];
  callSignatures: InterfaceCallSignatureDef[];
  indexSignatures: InterfaceIndexSignatureDef[];
  typeParams: TsTypeParamDef[];
}
export interface InterfaceIndexSignatureDef {
  readonly: boolean;
  params: ParamDef[];
  tsType?: TsTypeDef;
}
export interface TypeAliasDef {
  tsType: TsTypeDef;
}
export interface NamespaceDef {
  elements: DocNode[];
}
export interface ImportDef {
  src: string;
  local: string;
  imported?: string;
}

export type DocNodeFunction = DocNodeShared & {
  kind: DocNodeKind.Function;
  functionDef: FunctionDef;
};
export type DocNodeVariable = DocNodeShared & {
  kind: DocNodeKind.Variable;
  variableDef: VariableDef;
};
export type DocNodeClass = DocNodeShared & {
  kind: DocNodeKind.Class;
  classDef: ClassDef;
};
export type DocNodeEnum = DocNodeShared & {
  kind: DocNodeKind.Enum;
  enumDef: EnumDef;
};
export type DocNodeInterface = DocNodeShared & {
  kind: DocNodeKind.Interface;
  interfaceDef: InterfaceDef;
};
export type DocNodeTypeAlias = DocNodeShared & {
  kind: DocNodeKind.TypeAlias;
  typeAliasDef: TypeAliasDef;
};
export type DocNodeNamespace = DocNodeShared & {
  kind: DocNodeKind.Namespace;
  namespaceDef: NamespaceDef;
};
export type DocNodeImport = DocNodeShared & {
  kind: DocNodeKind.Import;
  importDef: ImportDef;
};

export type DocNode =
  | DocNodeFunction
  | DocNodeVariable
  | DocNodeClass
  | DocNodeEnum
  | DocNodeInterface
  | DocNodeTypeAlias
  | DocNodeNamespace
  | DocNodeImport;

export interface GroupedNodes {
  functions: DocNodeFunction[];
  variables: DocNodeVariable[];
  classes: DocNodeClass[];
  enums: DocNodeEnum[];
  interfaces: DocNodeInterface[];
  typeAliases: DocNodeTypeAlias[];
  namespaces: DocNodeNamespace[];
}

export function expandNamespaces(docs: DocNode[]): DocNode[] {
  return docs.flatMap((parent): any => {
    if (parent.kind === DocNodeKind.Namespace) {
      const scope = Array.isArray(parent.scope)
        ? [...parent.scope, parent.name]
        : [parent.name];
      return [
        {
          ...parent,
          namespaceDef: {
            elements: expandNamespaces(
              parent.namespaceDef.elements.map((el) => ({
                ...el,
                scope: scope,
              })),
            ),
          },
        },
      ];
    } else {
      return [parent];
    }
  });
}

export function flattenNamespaces(docs: DocNode[]): DocNode[] {
  return docs.flatMap((parent): any => {
    if (parent.kind === DocNodeKind.Namespace) {
      return [parent, ...flattenNamespaces(parent.namespaceDef.elements)];
    } else {
      return [parent];
    }
  });
}

function nodeName(a: DocNode): string {
  return (a.scope ? a.scope.join(".") + "." : "") + a.name;
}

export function sortByAlphabet(docs: DocNode[]): DocNode[] {
  return docs.sort((a, b) => {
    const scopeCountA = a.scope?.length ?? 0;
    const scopeCountB = b.scope?.length ?? 0;
    if (scopeCountA !== scopeCountB) {
      return scopeCountA - scopeCountB;
    }
    return (nodeName(a) < nodeName(b) ? -1 : 1);
  });
}

export function groupNodes(docs: DocNode[]): GroupedNodes {
  const groupedNodes: GroupedNodes = {
    functions: [],
    variables: [],
    classes: [],
    enums: [],
    interfaces: [],
    typeAliases: [],
    namespaces: [],
  };

  docs.forEach((node) => {
    switch (node.kind) {
      case DocNodeKind.Function:
        groupedNodes.functions.push(node);
        break;
      case DocNodeKind.Variable:
        groupedNodes.variables.push(node);
        break;
      case DocNodeKind.Class:
        groupedNodes.classes.push(node);
        break;
      case DocNodeKind.Enum:
        groupedNodes.enums.push(node);
        break;
      case DocNodeKind.Interface:
        groupedNodes.interfaces.push(node);
        break;
      case DocNodeKind.TypeAlias:
        groupedNodes.typeAliases.push(node);
        break;
      case DocNodeKind.Namespace:
        groupedNodes.namespaces.push(node);
        break;
      case DocNodeKind.Import:
        break;
    }
  });

  return groupedNodes;
}

function findNodeByScopedName(
  flattend: DocNode[],
  name: string,
  initialScope: string[],
  mustBe?: "type" | "class",
): DocNode | undefined {
  const scope = [...initialScope];
  let done = false;
  while (!done) {
    const node = flattend.find(
      (node) =>
        // Name + scope must match (if not import)
        node.kind !== DocNodeKind.Import &&
        (node.scope && node.scope?.length > 0
                ? node.scope.join(".") + "."
                : "") +
              node.name ===
          (scope.length > 0 ? scope.join(".") + "." : "") + name &&
        // Must be a type, or class, or any. Dependant on settings
        ((mustBe === "type" &&
          (node.kind === DocNodeKind.Class ||
            node.kind === DocNodeKind.Enum ||
            node.kind === DocNodeKind.Interface ||
            node.kind === DocNodeKind.TypeAlias ||
            node.kind === DocNodeKind.Namespace)) ||
          (mustBe === "class" && node.kind === DocNodeKind.Class) ||
          mustBe === undefined),
    );
    if (node) return node;
    if (scope.length === 0) {
      const import_ = flattend.find(
        (node) =>
          node.kind === DocNodeKind.Import &&
          (name + ".").startsWith(node.name + "."),
      );
      if (import_) return import_;
      done = true;
    }
    scope.pop();
  }
  return undefined;
}

function globalObjectMDN(name: string): { [name: string]: string } {
  return {
    [name]:
      `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${name}`,
  };
}

const MDN_BUILTINS: { [builtin: string]: string } = {
  ...globalObjectMDN("Object"),
  ...globalObjectMDN("Function"),
  ...globalObjectMDN("Boolean"),
  ...globalObjectMDN("Error"),
  ...globalObjectMDN("TypeError"),
  ...globalObjectMDN("Number"),
  ...globalObjectMDN("BigInt"),
  ...globalObjectMDN("Math"),
  ...globalObjectMDN("Date"),
  ...globalObjectMDN("String"),
  ...globalObjectMDN("RegExp"),
  ...globalObjectMDN("Array"),
  ...globalObjectMDN("Int8Array"),
  ...globalObjectMDN("Uint8Array"),
  ...globalObjectMDN("Uint8ClampedArray"),
  ...globalObjectMDN("Int16Array"),
  ...globalObjectMDN("Uint16Array"),
  ...globalObjectMDN("Int32Array"),
  ...globalObjectMDN("Uint32Array"),
  ...globalObjectMDN("Float32Array"),
  ...globalObjectMDN("Float64Array"),
  ...globalObjectMDN("BigInt64Array"),
  ...globalObjectMDN("BigUint64Array"),
  ...globalObjectMDN("Map"),
  ...globalObjectMDN("Set"),
  ...globalObjectMDN("WeakMap"),
  ...globalObjectMDN("WeakSet"),
  ...globalObjectMDN("ArrayBuffer"),
  ...globalObjectMDN("SharedArrayBuffer"),
  ...globalObjectMDN("Atomics"),
  ...globalObjectMDN("DataView"),
  ...globalObjectMDN("JSON"),
  ...globalObjectMDN("Promise"),
  ...globalObjectMDN("Generator"),
  ...globalObjectMDN("GeneratorFunction"),
  ...globalObjectMDN("AsyncFunction"),
  ...globalObjectMDN("Reflect"),
  ...globalObjectMDN("Proxy"),
  ...globalObjectMDN("Intl"),
};

export function getLinkByScopedName(
  flattend: DocNode[],
  runtimeBuiltins: DocNode[] | undefined,
  name: string,
  initialScope: string[],
  mustBe?: "type" | "class",
):
  | { type: "local"; href: string }
  | { type: "remote"; remote: string; node: string }
  | { type: "builtin"; href: string }
  | { type: "external"; href: string }
  | undefined {
  const node = findNodeByScopedName(flattend, name, initialScope, mustBe);
  if (node) {
    if (node.kind === DocNodeKind.Import) {
      if (node.importDef.imported) {
        return {
          type: "remote",
          remote: node.importDef.src,
          node: node.importDef.imported ?? node.name,
        };
      } else {
        return {
          type: "remote",
          remote: node.importDef.src,
          node: name.substring(node.name.length),
        };
      }
    }
    return {
      type: "local",
      href: `#${node.scope ? node.scope.join(".") + "." : ""}${node.name}`,
    };
  }
  if (runtimeBuiltins) {
    const node = findNodeByScopedName(
      runtimeBuiltins,
      name,
      [],
      mustBe,
    );
    if (node) {
      return {
        type: "builtin",
        href: `#${node.scope ? node.scope.join(".") + "." : ""}${node.name}`,
      };
    }
  }
  const builtin = MDN_BUILTINS[name];
  if (builtin) {
    return {
      type: "external",
      href: builtin,
    };
  }
  return undefined;
}

export function getFieldsForClassRecursive(
  flattend: DocNode[],
  parent: DocNodeClass,
): {
  methods: (ClassMethodDef & { inherited: boolean })[];
  properties: (ClassPropertyDef & { inherited: boolean })[];
} {
  if (parent.classDef.extends) {
    const node = findNodeByScopedName(
      flattend,
      parent.classDef.extends,
      parent.scope ?? [],
      "class",
    ) as DocNodeClass;
    if (node) {
      const r = getFieldsForClassRecursive(flattend, node);
      return {
        methods: [
          ...parent.classDef.methods.map((method) => ({
            ...method,
            inherited: false,
          })),
          ...r.methods.map((method) => ({
            ...method,
            inherited: true,
          })),
        ],
        properties: [
          ...parent.classDef.properties.map((property) => ({
            ...property,
            inherited: false,
          })),
          ...r.properties.map((property) => ({
            ...property,
            inherited: true,
          })),
        ],
      };
    }
  }

  return {
    methods: parent.classDef.methods.map((method) => ({
      ...method,
      inherited: false,
    })),
    properties: parent.classDef.properties.map((property) => ({
      ...property,
      inherited: false,
    })),
  };
}
