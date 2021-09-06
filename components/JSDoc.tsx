// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import ReactMarkdown from "react-markdown";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/cjs/languages/hljs/typescript";
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("ts", typescript);

export function JSDoc(props: { jsdoc: string }) {
  let jsdoc = props.jsdoc
    .replace(/(\n?)@param/g, "\n\n __param__")
    .replace(/(\n?)@return/g, "\n\n __return__")
    // [link text]{@link https://www.link.com}
    .replace(/\[(.*?)\]{@link (.*?)}/g, (match, text, link): string => {
      return `[${text}](${link})`;
    })
    // {@link https://www.link.com|link text}
    .replace(/{@link (.*?)\|(.*?)}/g, (match, link, text): string => {
      return `[${text}](${link})`;
    })
    // {@link https://www.link.com link text}
    .replace(/{@link ([^}]*?) ([^}]*?)}/g, (match, link, text): string => {
      return `[${text}](${link})`
    })
    // {@link https://www.link.com}
    .replace(/{@link (.*?)}/g, (match, link): string => {
      return `[${link}](${link})`
    })
    // @deprecated reason
    .replace(/(\n?)@deprecated/g, "\n\n__deprecated__");
  
  return (
    <ReactMarkdown
      source={jsdoc}
      renderers={{
        link: (props: any) => (
          <a className="text-blue-500" {...props}>
            {props.children}
          </a>
        ),
        inlineCode: InlineCode,
        code: CodeBlock,
        table: (props) => (
          <div className="w-full overflow-x-auto">
            <table
              {...props}
              className="my-2 border border-collapse border-gray-300 dark:border-light-black-800"
            />
          </div>
        ),
        tableCell: (props) => (
          <td
            {...props}
            className={
              "border border-gray-300 dark:border-light-black-600 px-2 py-1" +
              (props.isHeader ? " font-medium" : "")
            }
          />
        ),
      }}
    />
  );
}

export function InlineCode(props: { children: React.ReactNode }) {
  return (
    <code className="py-0.5 px-1 font-mono bg-gray-100 dark:bg-light-black-900 text-gray-800 dark:text-gray-300 rounded-sm">
      {props.children}
    </code>
  );
}

export function CodeBlock(props: { value: string; language: string }) {
  return (
    <div className="my-2 bg-gray-50 rounded overflow-hidden">
      <SyntaxHighlighter
        language={props.language ?? "typescript"}
        className="hljs"
        customStyle={{
          // SyntaxHighlighter or maybe tailwind sets the
          // `background-color` of `pre` to rgb(255, 255, 255). And
          // hljs uses `background: #..` which is not applied because of
          // background-color taking precedence. To give precedence to
          // `background`, we pass an invalid value to backgroundColor.
          backgroundColor: "none",
          fontSize: "0.75rem",
          padding: "0.5rem 0.75rem",
        }}
      >
        {props.value}
      </SyntaxHighlighter>
    </div>
  );
}
