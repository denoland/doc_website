// Copyright 2020-2021 the Deno authors. All rights reserved. MIT license.

import { ServerRequest } from "https://deno.land/std@0.84.0/http/server.ts";

const decoder = new TextDecoder();

export default async (req: ServerRequest) => {
  const url = new URL(req.url, "https://example.com");

  const entrypoint = url.searchParams.get("entrypoint");
  if (!entrypoint) {
    return await req.respond(error("missing entrypoint query parameter", 400));
  }

  const importMap = url.searchParams.get("import_map");
  const importMapValidationError = validateImportMap(importMap);
  if (importMapValidationError) {
    await req.respond(importMapValidationError);
  }

  const isRemote = entrypoint.startsWith("https://");

  let sourceFile: string;
  if (isRemote) {
    sourceFile = entrypoint;
  } else {
    return await req.respond(
      error("entrypoint must be a remote https:// module", 400)
    );
  }

  let cmd = ["deno", "doc", sourceFile, "--json", "--reload"];
  if (importMap) {
    cmd.push("--import-map", `data:application/json;base64,${btoa(importMap)}`);
  }

  const proc = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped",
    env: { DENO_DIR: "/tmp/denodir" },
  });

  let killed = false;

  // Zeit timeout is 60 seconds for pro tier: https://zeit.co/docs/v2/platform/limits
  const timer = setTimeout(() => {
    killed = true;
    proc.kill(Deno.Signal.SIGKILL);
  }, 58000);

  const [out, errOut] = await Promise.all([proc.output(), proc.stderrOutput()]);
  const status = await proc.status();
  clearTimeout(timer);
  proc.close();
  if (!status.success) {
    if (killed) return await req.respond(error("timed out", 500));
    return await req.respond(error(decoder.decode(errOut), 500));
  }

  return await req.respond({
    status: 200,
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      nodes: JSON.parse(decoder.decode(out)),
    }),
    headers: new Headers({
      "content-type": "application/json; charset=utf-8",
    }),
  });
};

function error(message: string, code: number) {
  return {
    status: code,
    body: JSON.stringify({
      error: message,
    }),
    headers: new Headers({
      "content-type": "application/json; charset=utf-8",
    }),
  };
}

function validateImportMap(maybeImportMap: string | null) {
  if (!maybeImportMap) return undefined;

  let parsedImportMap;
  try {
    parsedImportMap = JSON.parse(maybeImportMap);
  } catch (err) {
    return error("Invalid import map\n" + err.stack, 400);
  }

  if ("imports" in parsedImportMap || "scopes" in parsedImportMap) {
    return undefined;
  }

  return error(
    'import map is expected to have "imports" and/or "scopes" fields',
    400
  );
}
