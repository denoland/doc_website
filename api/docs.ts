// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

const decoder = new TextDecoder();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const url = new URL(
    JSON.parse(event.body || '{ "path": "" }').path,
    "https://example.com"
  );

  const entrypoint = url.searchParams.get("entrypoint");

  if (!entrypoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "missing entrypoint query parameter",
      }),
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    };
  }

  const isRemote = entrypoint.startsWith("https://");

  let sourceFile: string;
  if (isRemote) {
    sourceFile = entrypoint;
  } else {
    return error("entrypoint must be a remote https:// module", 400);
  }

  const proc = Deno.run({
    cmd: ["deno", "doc", sourceFile, "--json", "--reload"],
    stdout: "piped",
    stderr: "piped",
  });

  let killed = false;

  // Zeit timeout is 10 seconds for free tier: https://zeit.co/docs/v2/platform/limits
  const timer = setTimeout(() => {
    killed = true;
    proc.kill(Deno.Signal.SIGKILL);
  }, 9000);

  const out = await proc.output();
  const errOut = await proc.stderrOutput();
  const status = await proc.status();
  clearTimeout(timer);
  proc.close();
  if (!status.success) {
    if (killed) return error("timed out", 500);
    return error(decoder.decode(errOut), 500);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      nodes: JSON.parse(decoder.decode(out)),
    }),
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  };
}

function error(message: string, code: number) {
  return {
    statusCode: code,
    body: JSON.stringify({
      error: message,
    }),
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  };
}
