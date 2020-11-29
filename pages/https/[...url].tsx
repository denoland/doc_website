// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { Documentation } from "../../components/Documentation";
import { NextPage } from "next";

const Page: NextPage<{ entrypoint: string; name: string }> = (props) => (
  <Documentation {...props} />
);

Page.getInitialProps = async (ctx) => {
  let url =
    typeof ctx.query.url === "string"
      ? ctx.query.url
      : ctx.query.url === undefined
      ? ""
      : ctx.query.url.join("/");
  
  const regex = /(github\.com\/.+\/.+\/|gitlab\.com\/.+\/.+\/-\/)blob/
  if (url.match(regex)) {
    url = url.replace(regex, "$1raw")
  }
  
  return { entrypoint: "https://" + url, name: url };
};

export default Page;
