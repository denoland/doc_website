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
  name: String;
  snippet: string;
  location: DocNodeLocation;
  jsDoc?: String;
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
export interface ClassConstructorDef {
  jsDoc?: string;
  snippet: string;
  accessibility?: Accessibility;
  name: string;
}
export interface ClassPropertyDef {
  jsDoc?: string;
  snippet: string;
  tsType: TsTypeDef;
  readonly: boolean;
  accessibility?: Accessibility;
  isAbstract: boolean;
  isStatic: boolean;
  name: string;
}
export interface ClassMethodDef {
  jsDoc?: string;
  snippet: string;
  accessibility?: Accessibility;
  isAbstract: boolean;
  isStatic: boolean;
  name: string;
  kind: "method" | "getter" | "setter";
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
export interface InterfaceDef {}
export interface TypeAliasDef {}
export interface NamespaceDef {
  elements: DocNode[];
}

export type DocNode = DocNodeShared &
  (
    | {
        kind: DocNodeKind.Function;
        functionDef: FunctionDef;
      }
    | {
        kind: DocNodeKind.Variable;
        variableDef: VariableDef;
      }
    | {
        kind: DocNodeKind.Class;
        classDef: ClassDef;
      }
    | {
        kind: DocNodeKind.Enum;
        enumDef: EnumDef;
      }
    | {
        kind: DocNodeKind.Interface;
        interfaceDef: InterfaceDef;
      }
    | {
        kind: DocNodeKind.TypeAlias;
        typeAliasDef: TypeAliasDef;
      }
    | {
        kind: DocNodeKind.Namespace;
        namespaceDef: NamespaceDef;
      }
  );

export async function getDocs(): Promise<DocNode[]> {
  const req = await fetch("/docs.json");
  if (!req.ok) throw new Error("Failed to fetch docs.");
  return await req.json();
}
