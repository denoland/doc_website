import React from "react";
import { Link } from "./Link";

export function NotFound() {
  return (
    <div className="h-full flex justify-center items-center flex-col">
      <div className="text-gray-800 text-2xl">404 - Page not found.</div>
      <div className="text-blue-500">
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
}
