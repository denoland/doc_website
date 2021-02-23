// Copyright 2020 the Deno authors. All rights reserved. MIT license.

const origin = "https://doc-website-git-main.denoland.vercel.app/api/docs";

async function handleRequest(event) {
  let request = event.request;
  let url = new URL(request.url);
  const entrypoint = url.searchParams.get("entrypoint");
  if (!entrypoint) {
    return new Response(`{"error": "No entrypoint URL specified."}`, {
      status: 400,
    });
  }

  const remoteURL = new URL(
    `${origin}?entrypoint=${encodeURIComponent(entrypoint)}`,
  );

  let cacheKey = new Request(remoteURL, {
    method: request.method,
    headers: request.headers,
  });
  let cache = caches.default;

  const forceReload = url.searchParams.get("force_reload");

  // Get this request from this zone's cache
  let response = await cache.match(cacheKey);
  if (!response || forceReload) {
    //if not in cache, grab it from the origin
    response = await fetch(cacheKey);
    if (!response.ok) {
      return response;
    }
    // must use Response constructor to inherit all of response's fields
    response = new Response(response.body, response);
    // Cache API respects Cache-Control headers, so by setting max-age to 86400
    // the response will only live in cache for max of 24 * 60 * 60 seconds
    response.headers.append("Cache-Control", "max-age=86400");
    // store the fetched response as cacheKey
    // use waitUntil so computational expensive tasks don't delay the response
    event.waitUntil(cache.put(cacheKey, response.clone()));
  }
  response = new Response(response.body, response);
  response.headers.set("Cache-Control", "max-age=0");
  return response;
}

addEventListener("fetch", (event) => {
  try {
    return event.respondWith(handleRequest(event));
  } catch (e) {
    return event.respondWith(
      new Response(`{"error": "${e.message}"}`, {
        status: 500,
      }),
    );
  }
});
