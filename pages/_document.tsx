// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

export default class DenoDocDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" style={{ scrollPaddingTop: "5rem" }}>
        <Head>
          <link rel="stylesheet" href="/fonts/inter/inter.css" />
          <link rel="stylesheet" href="/styles/hljs/github.min.css" media="screen"/>
          <link rel="stylesheet" href="/styles/hljs/github-dark.min.css" media="screen and (prefers-color-scheme: dark)" />
        </Head>
        <body className="bg-gray-50 dark:bg-light-black-900">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
