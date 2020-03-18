export { fizz, buzz } from "./bar.ts"

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
export const fizzBuzz = "fizzBuzz";