import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import HashLinkHandler from "./components/HashLinkHandler";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <HashLinkHandler />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("app")
);
