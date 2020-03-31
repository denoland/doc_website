import React from "react";
import App from "next/app";
import "../components/app.css";

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className="h-screen">
        <Component {...pageProps} />
      </div>
    );
  }
}
