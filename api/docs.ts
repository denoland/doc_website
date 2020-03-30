import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context
} from "https://deno.land/x/lambda/mod.ts";

const decoder = new TextDecoder();

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const url = new URL(
    JSON.parse(event.body || '{ path: "" }').path,
    "https://example.com"
  );

  const entrypoint = url.searchParams.get("entrypoint");

  if (!entrypoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "missing entrypoint query parameter"
      }),
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    };
  }

  if (!entrypoint.startsWith("https://")) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "entrypoint must be a remote https:// module"
      }),
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    };
  }

  const proc = Deno.run({
    cmd: ["deno", "doc", entrypoint, "--json"],
    stdout: "piped",
    stderr: "piped"
  });

  const timer = setTimeout(() => {
    proc.kill(Deno.LinuxSignal.SIGKILL);
  }, 5000);

  const status = await proc.status();
  clearTimeout(timer);
  const errOut = await proc.stderrOutput();
  const out = await proc.output();
  proc.close();
  if (!status.success) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: decoder.decode(errOut)
      }),
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      nodes: JSON.parse(decoder.decode(out))
    }),
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  };
}
