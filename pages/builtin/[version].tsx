// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import { useRouter } from "next/router";
import { Documentation } from "../../components/Documentation";

const Page = () => {
  const { query } = useRouter();
  const version = query.version ?? "stable";
  return (
    <Documentation
      entrypoint={
        version == "stable"
          ? "https://github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
          : version === "unstable"
          ? "https://raw.githubusercontent.com/denoland/deno/main/cli/dts/lib.deno.unstable.d.ts"
          : `https://github.com/denoland/deno/releases/download/${version}/lib.deno.d.ts`
      }
      name={`builtin@${version}`}
    />
  );
};

export default Page;
