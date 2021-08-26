# deno_doc frontend

This website is built with [Next.js](https://nextjs.org) and automatically deploys to [Vercel](https://vercel.com).

### Contributing

Install [Vercel CLI](https://vercel.com/download) and run `vercel dev`. Currently not supported on Windows, see (https://github.com/lucacasonato/now-deno/issues/12)

For this to run succesfully you will need to change the `functions` object of the `vercel.json` file to: 

```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "vercel-deno@0.8.0",
      "maxDuration": 10
    }
  },
```

To install dependencies via npm, you must run `npm install` with the `--legacy-peer-deps` flag.
