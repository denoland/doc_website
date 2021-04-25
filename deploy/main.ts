import { serve } from "https://deno.land/x/sift@0.2.0/mod.ts";

const EXAMPLE_VERSION = "v1.9.0";

serve({
  "/": () =>
    new Response(
      `
      serving lib.deno.d.ts<br />
      visit
        <a href="/builtin/stable">/builtin/stable</a>,
        <a href="/builtin/${EXAMPLE_VERSION}">/builtin/${EXAMPLE_VERSION}</a>, for example<br />
      <br />
      <a href="https://github.com/kt3k/proxy-d-ts">GitHub</a>
      `,
      { status: 200, headers: { "content-type": "text/html" } },
    ),
  "/builtin/:version": async (request, params) => {
    if (!params) {
      return notFound();
    }
    const { version } = params;
    if (!version) {
      return notFound();
    }
    // Handles "stable" version differently
    const dtsUrl = version === "stable"
      ? "https://github.com/denoland/deno/releases/latest/download/lib.deno.d.ts"
      : `https://github.com/denoland/deno/releases/download/${version}/lib.deno.d.ts`;
    const resp = await fetch(dtsUrl);
    if (resp.status !== 200) {
      return notFound();
    }
    const isBrowser = request.headers.get("accept")?.includes("text/html");
    // The headers on a `Response` are immutable
    const headers = new Headers(resp.headers);
    // Responses as plain text to browsers
    headers.set(
      "content-type",
      isBrowser ? "text/plain" : "application/typescript; charset=utf-8",
    );
    // Prevents downloading the file
    headers.delete("content-disposition");
    return new Response(resp.body, { ...resp, headers });
  },
  404: () => notFound(),
});

function notFound(): Response {
  return new Response(`not found<br /><a href="/">Back to Top</a>`, {
    status: 404,
    headers: { "content-type": "text/html" },
  });
}
