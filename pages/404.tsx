import Link from "next/link";

export default () => {
  return (
    <>
      <head>
        <title>404 not found - deno doc</title>
      </head>
      <div className="h-full flex justify-center items-center flex-col p-4 text-center">
        <div className="text-gray-800 text-3xl">404 - Page not found</div>
        <Link href="/">
          <a className="text-blue-600 mt-4 text-xl">Go back home</a>
        </Link>
      </div>
    </>
  );
};
