```
$ cargo run ./test.ts

"* Hello there, this is a multiline JSdoc.\n * \n * It has many lines\n * \n * Or not that many?\n "
code line: "export function foo(a: string, b: number): void {"
"export function foo(a: string, b: number): void "
comment: "* This is single line JSdoc "
"This is single line JSdoc "
code line: "export function bar(a: string, b: number): void {"
"export function bar(a: string, b: number): void "
comment: "* Class doc "
"Class doc "
code line: "export class Foobar {"
"export class Foobar "
comment: "* Something about fizzBuzz "
"Something about fizzBuzz "
code line: "export const fizzBuzz = \"fizzBuzz\";"
"export const fizzBuzz = \"fizzBuzz\";"
```