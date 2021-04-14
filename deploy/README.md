# Proxy of lib.deno.d.ts as Deno Deploy script

Deno publishes `lib.deno.d.ts` for each release in the url
`https://github.com/denoland/deno/releases/download/${version}/lib.deno.d.ts`,
but it doesn't return correct content-type header. This Deno Deploy script
proxies that file with corrected content-type headers.
