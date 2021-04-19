// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { Documentation } from "../../components/Documentation";
import { NextPage } from "next";

const Page: NextPage<{ entrypoint: string; name: string }> = (props) => (
  <Documentation {...props} />
);

Page.getInitialProps = async (ctx) => {
  const url =
    typeof ctx.query.url === "string"
      ? ctx.query.url
      : ctx.query.url === undefined
      ? ""
      : ctx.query.url.join("/");
  return {
    entrypoint: "https://" + decodeURIComponent(url),
    name: decodeURIComponent(url),
  };
};

export default Page;
