import Head from "next/head";
import Link from "next/link";
import { CodeBlock, InlineCode } from "../components/JSDoc";

export default () => {
  return (
    <>
      <Head>
        <title>About deno doc</title>
        <meta
          name="description"
          content="About deno doc, a documentation generator for Deno."
        />
      </Head>
      <div className="border-b border-gray-200">
        <div className="flex justify-between h-16 sm:h-20 max-w-screen-md mx-auto py-2 py-4 px-4 sm:px-6 md:px-8">
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
        </div>
      </div>
      <div className="max-w-screen-md mx-auto pt-4 pb-12 sm:pb-16 md:pb-20 sm:py-6 px-4 sm:px-6 md:px-8">
        <h1 className="text-4xl font-bold">About</h1>
        <div className="text-base leading-6 pt-4 grid row-gap-3">
          <p>
            doc.deno.land hosts documentation for TypeScript and ES module files
            available on the public internet that use ES module import syntax
            with URLs.
          </p>
          <p className="mt-3">
            The source code is available on{" "}
            <a href="https://github.com/denoland/doc_website" className="link">
              GitHub
            </a>
            .
          </p>
        </div>
        <h3 className="text-2xl font-medium pt-6">
          Adding a module to deno doc
        </h3>
        <div className="text-base leading-6 pt-2">
          <p>
            doc.deno.land dynamically pulls a module from the specified URL and
            generates documentation for it when it is first viewed. You do not
            need to manually register a module on doc.deno.land to make it
            available.
          </p>
          <p className="mt-3">
            doc.deno.land caches generated documentation for 24 hours. After
            this time the generated documentation is removed from the cache and
            the module is treated as if it had never been requested before.
          </p>
        </div>
        <h3 className="text-2xl font-medium pt-6">
          Removing a module from deno doc
        </h3>
        <p className="text-base leading-6 pt-2">
          You can not manually remove modules from doc.deno.land as they expire
          automatically after 24 hours. If there is an urgent reason to remove a
          module from the cache, please reach out to one of the Deno maintainers
          on the{" "}
          <a href="https://discord.gg/TGMHGv6" className="link">
            Deno discord
          </a>
          .
        </p>
        <h3 className="text-2xl font-medium pt-6">Badges</h3>
        <div className="text-base leading-6 pt-2">
          <img src="/badge.svg" alt="deno doc badge" />
          <p className="mt-3">
            Below are examples of some snippets that you can use to link to
            doc.deno.land from your project website or README. Don't forget to
            replace the doc.deno.land url with the one for your module.
          </p>
          <div className="mt-3">
            <span className="font-medium">HTML</span>
            <CodeBlock
              language=""
              value={`<a href="https://doc.deno.land/https/deno.land/std/fs/mod.ts"><img src="https://doc.deno.land/badge.svg" alt="deno doc"></a>`}
            />
          </div>
          <div>
            <span className="font-medium">Markdown</span>
            <CodeBlock
              language=""
              value={`[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/std/fs/mod.ts)`}
            />
          </div>
        </div>
        <h3 className="text-2xl font-medium pt-6">Limitations</h3>
        <div className="text-base leading-6 pt-2">
          <p>
            doc.deno.land currently has some limitations that you should be
            aware of:
          </p>
          <ul className="list-disc mt-3 pl-8">
            <li>
              Imports are currently only followed one level deep. This means
              only imports in the top level module are analyzed.
            </li>
            <li>
              Only exports in the style{" "}
              <InlineCode>
                export <span className="italic">declaration</span>
              </InlineCode>{" "}
              and <InlineCode>export ... from ...</InlineCode> are analyzed.
              Exports in the form{" "}
              <InlineCode>
                export {"{"} <span className="italic">identifiers</span> {"}"}
              </InlineCode>{" "}
              and{" "}
              <InlineCode>
                export <span className="italic">identifier</span>
              </InlineCode>{" "}
              are currently ignored.
            </li>
            <li>
              The time to pull source files and generate documenation from these
              may not exceed 9 seconds. If you are running into a timeout issue
              because of this, please open an issue on{" "}
              <a
                href="https://github.com/denoland/doc_website"
                className="link"
              >
                GitHub
              </a>{" "}
              with a link to the module that is timing out.
            </li>
          </ul>
        </div>
        <h3 className="text-2xl font-medium pt-6">Feedback</h3>
        <p className="text-base leading-6 pt-2">
          On our{" "}
          <a href="https://github.com/denoland/doc_website" className="link">
            GitHub
          </a>{" "}
          you can open an issue to share any ideas, feature requests, questions,
          or issues you are having. For general discussion about Deno or
          doc.deno.land, please use our{" "}
          <a href="https://discord.gg/TGMHGv6" className="link">
            Discord server
          </a>
          .
        </p>
      </div>
    </>
  );
};
