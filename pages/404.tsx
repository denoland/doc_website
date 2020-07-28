// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import Link from "next/link";

function NotFound() {
  return (
    <>
      <head>
        <title>404 not found - deno doc</title>
      </head>
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="text-3xl text-gray-800">404 - Page not found</div>
        <Link href="/">
          <a className="mt-4 text-xl link">Go back home</a>
        </Link>
      </div>
    </>
  );
}

export default NotFound;
