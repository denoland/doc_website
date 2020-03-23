import React from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import ts from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import atomOneLight from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-light";
SyntaxHighlighter.registerLanguage("ts", ts);

export function JSDoc(props: { jsdoc: string; short?: boolean }) {
  const firstline = props.jsdoc.split("\n")[0];
  return (
    <ReactMarkdown
      source={props.short ? firstline : props.jsdoc}
      renderers={{
        link: (props: any) => (
          <a className="text-blue-400" {...props}>
            {props.children}
          </a>
        ),
        inlineCode: (props: { children: string }) => (
          <code className="font-mono bg-gray-200 px-1 ">{props.children}</code>
        ),
        code: CodeBlock,
        table: props => (
          <table
            {...props}
            className="border-collapse border-2 border-gray-400 my-2"
          />
        ),
        tableCell: props => (
          <td {...props} className="border border-gray-400 px-4 py-2" />
        )
      }}
    />
  );
}

export function CodeBlock(props: { value: string }) {
  return (
    <SyntaxHighlighter
      language="typescript"
      style={atomOneLight}
      customStyle={{ padding: "0.5rem 0.75rem", margin: "0.5rem 0" }}
    >
      {props.value}
    </SyntaxHighlighter>
  );
}
