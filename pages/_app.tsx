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
          <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </Head>
        <Component {...pageProps} />
      </div>
    );
  }
}
