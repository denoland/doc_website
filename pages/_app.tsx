// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import App from "next/app";
import "../components/app.css";
import Head from "next/head";

export default class DenoDocApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className="h-screen">
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </div>
    );
  }
}
