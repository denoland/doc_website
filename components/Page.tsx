// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

// TODO(lucacasonato): not have this use absolute positioning - make this less terrible CSS
export function Page(props: {
  children: React.ReactNode;
  forceReload: () => void;
  entrypoint: string;
  timestamp: string;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <div className="fixed z-20 bottom-auto flex justify-between h-16 sm:h-20 px-4 py-2 bg-white border-b border-gray-200 sm:px-6 w-full">
        <Link href="/">
          <a className="flex items-center">
            <img
              src="/logo.svg"
              alt="logo"
              className="w-12 h-12 sm:h-16 sm:w-16"
            />
            <div className="mx-2 text-xl font-bold text-gray-900 sm:text-3xl">
              deno doc
            </div>
          </a>
        </Link>
        <div
          className="inline-flex items-center justify-center p-2 text-gray-500 transition duration-150 ease-in-out rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 lg:hidden"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? (
            <svg
              className="w-6 h-6 sm:h-8 sm:w-8"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 sm:h-8 sm:w-8"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </div>
      </div>
      <div
        className={
          "lg:fixed flex flex-grow pt-16 sm:pt-20 lg:pt-0 lg:top-20 bottom-auto min-h-full lg:h-auto lg:bottom-0 left-0 right-0 lg:right-auto z-10 lg:w-xs w-max-full lg:block bg-white overflow-y-auto" +
          (drawerOpen ? "" : " hidden")
        }
      >
        <div
          onClick={(e) => {
            if (e.target instanceof HTMLAnchorElement) setDrawerOpen(false);
          }}
        >
          <Sidebar
            forceReload={props.forceReload}
            timestamp={props.timestamp}
            entrypoint={props.entrypoint}
          />
        </div>
      </div>
      <div
        className={
          "pt-16 sm:pt-20 lg:pl-xs overflow-y-auto bg-gray-100 lg:block min-h-full" +
          (drawerOpen ? " hidden" : "")
        }
      >
        {props.children}
      </div>
    </>
  );
}
