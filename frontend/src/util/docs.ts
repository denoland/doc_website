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
export interface TsTypeDef {
  repr: string;
}
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
  type_: TsTypeDef;
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
export interface InterfaceDef { }
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