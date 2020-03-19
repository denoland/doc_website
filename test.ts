// export { fizz, buzz } from "./bar.ts"


// export decl Fn(FnDecl { 
//     ident: Ident { 
//         span: Span { lo: BytePos(159), hi: BytePos(162), ctxt: #0 }, 
//         sym: Atom('foo' type=inline), 
//         type_ann: None, 
//         optional: false 
//     }, 
//     declare: false, 
//     function: Function { 
//         params: [
//             Ident(Ident { 
//                 span: Span { lo: BytePos(163), hi: BytePos(172), ctxt: #0 }, 
//                 sym: Atom('a' type=inline), 
//                 type_ann: Some(TsTypeAnn { 
//                     span: Span { lo: BytePos(164), hi: BytePos(172), ctxt: #0 }, 
//                     type_ann: TsKeywordType(TsKeywordType { 
//                         span: Span { lo: BytePos(166), hi: BytePos(172), ctxt: #0 }, 
//                         kind: TsStringKeyword 
//                     }) 
//                 }), 
//                 optional: false 
//             }), 
//             Ident(Ident { 
//                 span: Span { lo: BytePos(174), hi: BytePos(183), ctxt: #0 },
//                 sym: Atom('b' type=inline), 
//                 type_ann: Some(TsTypeAnn { 
//                     span: Span { lo: BytePos(175), hi: BytePos(183), ctxt: #0 }, 
//                     type_ann: TsKeywordType(TsKeywordType { 
//                         span: Span { lo: BytePos(177), hi: BytePos(183), ctxt: #0 }, 
//                         kind: TsNumberKeyword 
//                     }) 
//                 }), 
//                 optional: false 
//             })
//         ], 
//         decorators: [], 
//         span: Span { lo: BytePos(150), hi: BytePos(226), ctxt: #0 }, 
//         body: Some(BlockStmt { 
//             span: Span { lo: BytePos(191), hi: BytePos(226), ctxt: #0 }, 
//             stmts: [Expr(ExprStmt { 
//                 span: Span { lo: BytePos(197), hi: BytePos(224), ctxt: #0 }, 
//                 expr: Call(CallExpr { 
//                     span: Span { lo: BytePos(197), hi: BytePos(223), ctxt: #0 }, 
//                     callee: Expr(Member(MemberExpr { 
//                         span: Span { lo: BytePos(197), hi: BytePos(208), ctxt: #0 }, 
//                         obj: Expr(Ident(Ident { 
//                             span: Span { lo: BytePos(197), hi: BytePos(204), ctxt: #0 }, 
//                             sym: Atom('console' type=inline), type_ann: None, optional: false 
//                         })), 
//                         prop: Ident(Ident { 
//                             span: Span { lo: BytePos(205), hi: BytePos(208), ctxt: #0 }, 
//                             sym: Atom('log' type=inline), 
//                             type_ann: None, 
//                             optional: false 
//                         }), 
//                         computed: false 
//                     })), 
//                     args: [
//                         ExprOrSpread { 
//                             spread: None, 
//                             expr: Lit(Str(Str { 
//                                 span: Span { lo: BytePos(209), hi: BytePos(222), ctxt: #0 }, 
//                                 value: Atom('Hello world' type=dynamic), 
//                                 has_escape: false 
//                             })) 
//                         }
//                     ], 
//                     type_args: None 
//                 }) 
//             })] 
//         }), 
//         is_generator: false, 
//         is_async: false, 
//         type_params: None, 
//         return_type: Some(TsTypeAnn { 
//             span: Span { lo: BytePos(184), hi: BytePos(190), ctxt: #0 }, 
//             type_ann: TsKeywordType(TsKeywordType { 
//                 span: Span { lo: BytePos(186), hi: BytePos(190), ctxt: #0 }, 
//                 kind: TsVoidKeyword 
//             }) 
//         }) 
//     } 
// })

/**
 * Hello there, this is a multiline JSdoc.
 * 
 * It has many lines
 * 
 * Or not that many?
 */
export function foo(a: string, b: number): void {
    console.log("Hello world");
}

// /** This is single line JSdoc */
// export function bar(a: string, b: number): void {
//     console.log("Hello world");
// }

// /** Class doc */
// export class Foobar {
//     private private1: boolean;
//     protected protected1: number;
//     public public1: boolean;
//     public2: number;

//     constructor(name: string, private private2: number, protected protected2: number) {}

//     /** Async foo method */
//     async foo(): Promise<void> {
//         //
//     }

//     /** Sync bar method */
//     bar(): void {
//         //
//     }
// }

// /** Something about fizzBuzz */
// export const fizzBuzz: string = "fizzBuzz";

// // export decl Var(
// //     VarDecl { 
// //         span: Span { lo: BytePos(774), hi: BytePos(802), ctxt: #0 }, 
// //         kind: "const", 
// //         declare: false, 
// //         decls: [
// //             VarDeclarator { 
// //                 span: Span { lo: BytePos(780), hi: BytePos(801), ctxt: #0 }, 
// //                 name: Ident(Ident { 
// //                     span: Span { lo: BytePos(780), hi: BytePos(788), ctxt: #0 }, 
// //                     sym: Atom('fizzBuzz' type=dynamic), 
// //                     type_ann: None, 
// //                     optional: false 
// //                 }), 
// //                 init: Some(Lit(Str(Str { 
// //                     span: Span { lo: BytePos(791), hi: BytePos(801), ctxt: #0 }, 
// //                     value: Atom('fizzBuzz' type=dynamic), 
// //                     has_escape: false 
// //                 }))), 
// //                 definite: false 
// //             }
// //         ] 
// //     }
// // )

// // export decl Var(
// //     VarDecl { 
// //         span: Span { lo: BytePos(774), hi: BytePos(810), ctxt: #0 }, 
// //         kind: "const", 
// //         declare: false, 
// //         decls: [
// //             VarDeclarator { 
// //                 span: Span { lo: BytePos(780), hi: BytePos(809), ctxt: #0 }, 
// //                 name: Ident(Ident { 
// //                     span: Span { lo: BytePos(780), hi: BytePos(788), ctxt: #0 }, 
// //                     sym: Atom('fizzBuzz' type=dynamic), 
// //                     type_ann: Some(TsTypeAnn { 
// //                         span: Span { lo: BytePos(788), hi: BytePos(796), ctxt: #0 }, 
// //                         type_ann: TsKeywordType(TsKeywordType { 
// //                             span: Span { lo: BytePos(790), hi: BytePos(796), ctxt: #0 }, 
// //                             kind: TsStringKeyword 
// //                         }) 
// //                     }), 
// //                     optional: false 
// //                 }), 
// //                 init: Some(Lit(Str(Str { 
// //                     span: Span { lo: BytePos(799), hi: BytePos(809), ctxt: #0 }, 
// //                     value: Atom('fizzBuzz' type=dynamic), has_escape: false
// //                 }))), 
// //                 definite: false 
// //             }
// //         ] 
// //     }
// // )

// const a = {
//     "kind": "var",
//     "name": "fizzBuz",
//     ""
// };

// export interface Reader {
//     /** Read n bytes */
//     read(buf: Uint8Array, something: unknown): Promise<number>
// }

// /** Array holding numbers */
// export type NumberArray = Array<number>;

// /**
//  * Some enum for good measure
//  */
// export const enum Hello {
//     World = "world",
//     Fizz = "fizz",
//     Buzz = "buzz",
// }

// export namespace C {  
//     export var x = 1;  
// }