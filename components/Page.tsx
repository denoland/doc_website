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
      <div className="absolute inset-0 bottom-auto flex justify-between h-16 px-4 py-2 bg-white border-b border-gray-200 sm:h-20 sm:px-6">
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
      <div className="absolute inset-0 flex flex-grow top-16 sm:top-20">
        <div
          className={
            "bg-white lg:max-w-xs w-full overflow-y-auto absolute lg:static inset-0" +
            (drawerOpen ? "" : " hidden lg:block")
          }
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
        <div className="w-full overflow-y-auto bg-gray-100">
          {props.children}
        </div>
      </div>
    </>
  );
}
