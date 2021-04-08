// Copyright 2020-2021 the Deno authors. All rights reserved. MIT license.

import { ServerRequest } from "https://deno.land/std@0.84.0/http/server.ts";

const decoder = new TextDecoder();

export default async (req: ServerRequest) => {
  const url = new URL(req.url, "https://example.com");

  const entrypoint = url.searchParams.get("entrypoint");

  if (!entrypoint) {
    return await req.respond(error("missing entrypoint query parameter", 400));
  }

  const isRemote = entrypoint.startsWith("https://");

  let sourceFile: string;
  if (isRemote) {
    sourceFile = entrypoint;
  } else {
    return await req.respond(
      error("entrypoint must be a remote https:// module", 400),
    );
  }

  const {
    tempFilename,
    clearTempFile
  } = await downloadFileInTempDir(sourceFile);

  const proc = Deno.run({
    cmd: ["deno", "doc", tempFilename, "--json", "--reload"],
    stdout: "piped",
    stderr: "piped",
    env: { "DENO_DIR": "/tmp/denodir" },
  });

  let killed = false;

  // Zeit timeout is 60 seconds for pro tier: https://zeit.co/docs/v2/platform/limits
  const timer = setTimeout(() => {
    killed = true;
    proc.kill(Deno.Signal.SIGKILL);
    clearTempFile();
  }, 58000);

  const [out, errOut] = await Promise.all([proc.output(), proc.stderrOutput()]);
  const status = await proc.status();
  clearTimeout(timer);
  proc.close();
  clearTempFile();
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

// In vercel, uses /tmp, otherwise use local ./tmp directory
const tempDir = Deno.env.get("VERCEL") === "1" ? "/tmp" : "tmp";

async function downloadFileInTempDir(sourceFile: string) {
  // Creates random file name, ex. "/tmp/temp_rdcju7a.ts"
  const tempFilename = `${tempDir}/temp_{Math.random().toString(36).substring(6)}.ts`;
  const resp = await fetch(sourceFile);
  // TODO(kt3k): This should be streaming
  const text = await resp.text();
  await Deno.writeTextFile(tempFilename, text);
  const clearTempFile = async () => {
    try {
      await Deno.remove(tempFilename);
    } catch {
      // skip
    }
  }

  return { tempFilename, clearTempFile }
}
