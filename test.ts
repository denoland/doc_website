// export { fizz, buzz } from "./bar.ts"

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
export class Foobar {
    private private1: boolean;
    protected protected1: number;
    public public1: boolean;
    public2: number;

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

/** Something about fizzBuzz */
export const fizzBuzz: string = "fizzBuzz";

/**
 * Interface js doc
 */
export interface Reader {
    /** Read n bytes */
    read(buf: Uint8Array, something: unknown): Promise<number>
}

/** Array holding numbers */
export type NumberArray = Array<number>;

/**
 * Some enum for good measure
 */
export enum Hello {
    World = "world",
    Fizz = "fizz",
    Buzz = "buzz",
}

export namespace C {  
    export var x = 1;  
}