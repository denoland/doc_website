// Copyright 2020 the Deno authors. All rights reserved. MIT license.

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import Transition from "./Transition";
import { GroupedNodes } from "../util/docs";

// TODO(lucacasonato): not have this use absolute positioning - make this less terrible CSS
export function Wrapper(props: {
  children: React.ReactNode;
  forceReload: () => void;
  entrypoint: string;
  timestamp: string;
  groups: GroupedNodes | undefined;
}) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const hideSidebar = () => setShowSidebar(false);

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-light-black-800">
      <Transition show={showSidebar}>
        <div className="md:hidden">
          <div className="fixed inset-0 flex z-40">
            <Transition
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0">
                <div
                  className="absolute inset-0 bg-gray-600 opacity-75"
                  onClick={hideSidebar}
                ></div>
              </div>
            </Transition>
            <Transition
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-light-black-900">
                <div className="absolute top-0 right-0 -mr-14 p-1">
                  <button
                    role="button"
                    className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                    aria-label="Close sidebar"
                    onClick={hideSidebar}
                  >
                    <svg
                      className="h-6 w-6 text-white"
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
                  </button>
                </div>
                <div className="bg-gray-100 dark:bg-light-black-950 pb-4 pt-4 border-b border-gray-200 dark:border-light-black-700">
                  <Link href="/">
                    <a className="flex items-center flex-shrink-0 px-4">
                      <img
                        src="/favicon.svg"
                        alt="logo"
                        className="w-auto h-12"
                      />
                      <div className="mx-4 flex flex-col justify-center">
                        <div className="font-bold text-gray-900 dark:text-gray-200 leading-6 text-2xl tracking-tight">
                          deno doc
                        </div>
                      </div>
                    </a>
                  </Link>
                  {props.groups ? (
                    <header className="pt-4 pb-2 px-4">
                      {props.timestamp ? (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Last refreshed{" "}
                          {new Date(props.timestamp).toLocaleString()}.{" "}
                          <a
                            className="text-sm cursor-pointer link"
                            onClick={props.forceReload}
                          >
                            Refresh now
                          </a>
                        </div>
                      ) : null}
                      <p className="mt-2 text-sm">
                        <Link href="/about">
                          <a className="link">About doc.deno.land</a>
                        </Link>
                      </p>
                    </header>
                  ) : null}
                </div>
                {props.groups ? <Sidebar groups={props.groups} /> : null}
              </div>
            </Transition>
            <div className="flex-shrink-0 w-14">
              {/*<!-- Dummy element to force sidebar to shrink to fit close icon -->*/}
            </div>
          </div>
        </div>
      </Transition>
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 border-r border-gray-200 dark:border-light-black-700 bg-gray-50 dark:bg-light-black-900">
          <div className="bg-gray-100 dark:bg-light-black-950 pb-4 pt-4 border-b border-gray-200 dark:border-light-black-700">
            <Link href="/">
              <a className="flex items-center flex-shrink-0 px-4">
                <img src="/favicon.svg" alt="logo" className="w-auto h-12" />
                <div className="mx-4 flex flex-col justify-center">
                  <div className="font-bold text-gray-900 dark:text-gray-200 leading-6 text-2xl tracking-tight">
                    deno doc
                  </div>
                </div>
              </a>
            </Link>
            {props.groups ? (
              <header className="pt-4 pb-2 px-4">
                {props.timestamp ? (
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Last refreshed {new Date(props.timestamp).toLocaleString()}.{" "}
                    <a
                      className="text-sm cursor-pointer link"
                      onClick={props.forceReload}
                    >
                      Refresh now
                    </a>
                  </div>
                ) : null}
                <p className="mt-2 text-sm">
                  <Link href="/about">
                    <a className="link">About doc.deno.land</a>
                  </Link>
                </p>
              </header>
            ) : null}
          </div>
          {props.groups ? <Sidebar groups={props.groups} /> : null}
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-light-black-950 shadow md:hidden border-b border-gray-200 dark:border-light-black-700">
          <Link href="/">
            <a className="px-4 flex items-center justify-center md:hidden">
              <img src="/favicon.svg" alt="logo" className="w-auto h-10" />
            </a>
          </Link>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* <div className="w-full flex md:ml-0">
                  <label htmlFor="search_field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="search_field"
                      className="block w-full h-full pl-8 pr-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div> */}
            </div>
          </div>
          <button
            className="px-4 text-gray-500 dark:text-gray-200 focus:outline-none focus:bg-gray-100 dark:focus:bg-light-black-900 focus:text-gray-600 dark:focus:text-gray-400 md:hidden"
            aria-label="Open sidebar"
            onClick={() => setShowSidebar(true)}
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>

        <main
          className="flex-1 relative z-0 overflow-y-auto focus:outline-none"
          tabIndex={0}
        >
          {props.children}
        </main>
      </div>
    </div>
  );
}
