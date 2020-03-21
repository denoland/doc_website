// export { fizz, buzz } from "./bar.ts"

// /**
//  * Complicated function
//  */
// export function diagnostics(a: Promise<string>, b: () => Record<string, string>): Promise<[DiagnosticItem[] | undefined, Record<string, string>]> {

// };

// /**
//  * Hello there, this is a multiline JSdoc.
//  * 
//  * It has many lines
//  * 
//  * Or not that many?
//  */
// export function foo(a: string, b: number): void {
//     console.log("Hello world");
// }

// /** This is single line JSdoc */
// export function bar(a: string, b: number): void {
//     console.log("Hello world");
// }

/** Class doc */
export class Foobar extends Fizz implements Buzz {
    private private1: boolean;
    /** Js doc for protected1 */
    protected protected1: number;
    public public1: boolean;
    /** 
     * Js doc for public2
     * 
     * Foobar
     * 
     * Foo
     */
    public2: number;

    /** Constructor js doc */
    constructor(name: string, private private2: number, protected protected2: number) {}

    /** Async foo method */
    async foo(): Promise<void> {
        //
    }

    /** Sync bar method */
    bar(): void {
        //
    }
}

// /** Something about fizzBuzz */
// export const fizzBuzz: string = "fizzBuzz";

// /**
//  * Interface js doc
//  */
// export interface Reader {
//     /** Read n bytes */
//     read(buf: Uint8Array, something: unknown): Promise<number>
// }

// /** Array holding numbers */
// export type NumberArray = Array<number>;

// export type OperatingSystem = "mac" | "win" | "linux";

// export type Arch = "x64" | "arm64";

// /**
//  * Some enum for good measure
//  */
// export enum Hello {
//     World = "world",
//     Fizz = "fizz",
//     Buzz = "buzz",
// }

// export namespace C {  
//     export var x = 1;  
// }

// /** **UNSTABLE**: new API. Maybe move `Deno.EOF` here.
//  *
//  * Special Deno related symbols. */
// export const symbols: {
// /** Symbol to access exposed internal Deno API */
// readonly internal: unique symbol;
// /** A symbol which can be used as a key for a custom method which will be
//  * called when `Deno.inspect()` is called, or when the object is logged to
//  * the console. */
// readonly customInspect: unique symbol;
// // TODO(ry) move EOF here?
// };


