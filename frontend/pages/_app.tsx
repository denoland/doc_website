import React from "react";
import App from "next/app";
import "../components/app.css";

export default class DenoDocApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
