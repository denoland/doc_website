import { Documentation } from "../../components/Documentation";
import { NextPage } from "next";

const Page: NextPage<{ entrypoint: string; name: string }> = (props) => (
  <Documentation {...props} />
);

Page.getInitialProps = async (ctx) => {
  const url =
    typeof ctx.query.url === "string" ? ctx.query.url : ctx.query.url.join("/");
  return { entrypoint: "https://" + url, name: url };
};

export default Page;
