export enum DocNodeKind {
  Function = "function",
  Variable = "variable",
  Class = "class",
  Enum = "enum",
  Interface = "interface",
  TypeAlias = "typeAlias",
  Namespace = "namespace"
}

export interface DocNodeLocation {
  filename: String;
  line: number;
  col: number;
}
export interface DocNodeShared {
  name: string;
  snippet: string;
  location: DocNodeLocation;
  jsDoc?: string;
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
export interface LiteralMethodDef {
  params: ParamDef[];
  returnType?: TsTypeDef;
}
export enum LiteralDefKind {
  Number = "number",
  String = "string",
  Boolean = "boolean"
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
  TypeLiteral = "typeLiteral"
}
export interface TsTypeDefShared {
  repr: string;
}
export type TsTypeDef = TsTypeDefShared &
  (
    | { kind: TsTypeDefKind.Array; array: TsTypeDef }
    | { kind: TsTypeDefKind.Conditional; conditionalType: TsConditionalDef }
    | {
        kind: TsTypeDefKind.FnOrConstructor;
        fnOrConstructor: TsFnOrConstructorDef;
      }
    | { kind: TsTypeDefKind.IndexedAccess; indexedAccess: TsIndexedAccessDef }
    | { kind: TsTypeDefKind.Intersection; intersection: TsTypeDef[] }
    | { kind: TsTypeDefKind.Keyword; keyword: string }
    | { kind: TsTypeDefKind.Literal; literal: LiteralDef }
    | { kind: TsTypeDefKind.Optional; optional: TsTypeDef }
    | { kind: TsTypeDefKind.Parenthesized; parenthesized: TsTypeDef }
    | { kind: TsTypeDefKind.Rest; rest: TsTypeDef }
    | { kind: TsTypeDefKind.This; this: boolean }
    | { kind: TsTypeDefKind.Tuple; tuple: TsTypeDef[] }
    | { kind: TsTypeDefKind.TypeLiteral; typeLiteral: TsTypeLiteralDef }
    | { kind: TsTypeDefKind.TypeOperator; typeOperator: TsTypeOperatorDef }
    | { kind: TsTypeDefKind.TypeQuery; typeQuery: string }
    | { kind: TsTypeDefKind.TypeRef; typeRef: TsTypeRefDef }
    | { kind: TsTypeDefKind.Union; union: TsTypeDef[] }
  );
export interface ParamDef {
  name: string;
  tsType?: TsTypeDef;
}
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
  isAbstract: boolean;
  isStatic: boolean;
}
export interface ClassMethodDef extends DocNodeShared {
  accessibility?: Accessibility;
  isAbstract: boolean;
  isStatic: boolean;
  kind: "method" | "getter" | "setter";
  functionDef: FunctionDef;
}
export interface ClassDef {
  isAbstract: boolean;
  constructors: ClassConstructorDef[];
  properties: ClassPropertyDef[];
  methods: ClassMethodDef[];
}
export interface EnumMemberDef {
  name: string;
}
export interface EnumDef {
  members: EnumMemberDef[];
}

export interface InterfaceMethodDef extends DocNodeShared {
  params: ParamDef[];
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
  methods: InterfaceMethodDef[];
  properties: InterfacePropertyDef[];
  callSignatures: InterfaceCallSignatureDef[];
}

export interface InterfaceDef {}
export interface TypeAliasDef {
  tsType: TsTypeDef;
}
export interface NamespaceDef {
  elements: DocNode[];
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

export type DocNode =
  | DocNodeFunction
  | DocNodeVariable
  | DocNodeClass
  | DocNodeEnum
  | DocNodeInterface
  | DocNodeTypeAlias
  | DocNodeNamespace;

export async function getDocs(): Promise<DocNode[]> {
  const req = await fetch("/docs.json");
  if (!req.ok) throw new Error("Failed to fetch docs.");
  return await req.json();
}

export interface GroupedNodes {
  functions: DocNodeFunction[];
  variables: DocNodeVariable[];
  classes: DocNodeClass[];
  enums: DocNodeEnum[];
  interfaces: DocNodeInterface[];
  typeAliases: DocNodeTypeAlias[];
  namespaces: DocNodeNamespace[];
}

export function sortByAlphabet(docs: DocNode[]): DocNode[] {
  return docs.sort((a, b) => a.name.localeCompare(b.name));
}

export function groupNodes(docs: DocNode[]): GroupedNodes {
  const groupedNodes: GroupedNodes = {
    functions: [],
    variables: [],
    classes: [],
    enums: [],
    interfaces: [],
    typeAliases: [],
    namespaces: []
  };

  docs.forEach(node => {
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
    }
  });

  return groupedNodes;
}

export function findNodeByType(
  nodes: DocNode[],
  type: TsTypeDef
): DocNode | undefined {
  return type.kind === TsTypeDefKind.TypeRef
    ? nodes.find(
        node =>
          node.name === type.typeRef?.typeName &&
          (node.kind === DocNodeKind.Class ||
            node.kind === DocNodeKind.Enum ||
            node.kind === DocNodeKind.Interface ||
            node.kind === DocNodeKind.TypeAlias)
      )
    : undefined;
}
