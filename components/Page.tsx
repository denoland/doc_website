import React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

// TODO(lucacasonato): not have this use absolute positioning - make this less terrible CSS
export function Page(props: {
  children: React.ReactNode;
  forceReload: () => void;
  entrypoint: string;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <>
      <div className="bg-white h-16 sm:h-20 px-4 sm:px-6 py-2 flex justify-between border-b border-gray-200 absolute inset-0 bottom-auto">
        <Link href="/">
          <a className="flex items-center">
            <img
              src="/logo.svg"
              alt="logo"
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <div className="text-gray-900 text-xl sm:text-3xl mx-2  font-bold">
              deno doc
            </div>
          </a>
        </Link>
        <div
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out lg:hidden"
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          {drawerOpen ? (
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8"
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
              className="h-6 w-6 sm:h-8 sm:w-8"
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
      <div className="flex flex-grow absolute inset-0 top-16 sm:top-20">
        <div
          className={
            "bg-white lg:max-w-xs w-full overflow-y-scroll absolute lg:static inset-0" +
            (drawerOpen ? "" : " hidden lg:block")
          }
          onClick={(e) => {
            if (e.target instanceof HTMLAnchorElement) setDrawerOpen(false);
          }}
        >
          <Sidebar
            forceReload={props.forceReload}
            entrypoint={props.entrypoint}
          />
        </div>
        <div className="w-full overflow-y-scroll bg-gray-100">
          {props.children}
        </div>
      </div>
    </>
  );
}
