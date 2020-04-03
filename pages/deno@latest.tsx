import { Documentation } from "../components/Documentation";
import { NextPage, GetStaticProps } from "next";

const Page: NextPage<{ entrypoint: string; name: string }> = props => (
  <Documentation {...props} />
);

export const getStaticProps: GetStaticProps<{
  entrypoint: string;
  name: string;
}> = async ctx => {
  return {
    props: {
      entrypoint: `deno://latest/lib.deno.d.ts`,
      name: "Deno runtime"
    }
  };
};

export default Page;
