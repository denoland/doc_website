// export { fizz, buzz } from "./bar.ts"


/** Something about fizzBuzz */
export const fizzBuzz: string = "fizzBuzz";

/**
 * Complicated function
 */
export function diagnostics(a: Promise<string>, b: () => Record<string, string>): Promise<[DiagnosticItem[] | undefined, Record<string, string>]> {

};

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

/** This is single line JSdoc */
export function bar(a: string, b: number): void {
    console.log("Hello world");
}

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

/**
 * Interface js doc
 */
export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
}

/** Array holding numbers */
export type NumberArray = Array<number>;
export type OperatingSystem = "mac" | "win" | "linux";
export type Arch = "x64" | "arm64";
export type BuildInfo = OperatingSystem | Arch;
export type ReadonlyArray<T> = Array<T>;

/**
 * Some enum for good measure
 */
export enum Hello {
    World = "world",
    Fizz = "fizz",
    Buzz = "buzz",
}

/** Root namespace JSdoc */
export namespace Deno {
    /** Export var JSdoc */
    export var x = 1;  

    /**
     * Nested namespace JSdoc
     */
    export namespace Nested {
        /** nestedConst JSdoc */
        export const nestedConst = "a";
    }

    /** Nested.Deeply namespace JSdoc */
    export namespace Nested.Deeply {
        /** 
         * nestedDeeplyConst JSdoc 
         */
        export const nestedDeeplyConst = "a";
    }
}
