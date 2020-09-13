import Head from "next/head";
import Link from "next/link";
import { CodeBlock, InlineCode } from "../components/JSDoc";
import Header from "../components/Header";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="bg-white dark:bg-light-black-800">
      <Head>
        <title>About deno doc</title>
        <meta
          name="description"
          content="About deno doc, a documentation generator for Deno."
        />
      </Head>
      <Header />
      <div className="max-w-screen-md mx-auto pt-4 pb-12 sm:pb-16 md:pb-20 sm:py-6 px-4 sm:px-6 md:px-8 text-gray-900 dark:text-gray-200">
        <h2 className="text-3xl font-bold tracking-tight">About</h2>
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
        <div className="mt-12">
          <h3
            className="text-2xl font-semibold tracking-tight"
            id="adding-a-module-to-deno-doc"
          >
            Adding a module to deno doc
          </h3>
          <p className="mt-2">
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
        <div className="mt-12">
          <h3
            className="text-2xl font-semibold tracking-tight"
            id="removing-a-module-from-deno-doc"
          >
            Removing a module from deno doc
          </h3>
          <p className="pt-2">
            You can not manually remove modules from doc.deno.land as they
            expire automatically after 24 hours. If there is an urgent reason to
            remove a module from the cache, please reach out to one of the Deno
            maintainers on the{" "}
            <a href="https://discord.gg/TGMHGv6" className="link">
              Deno discord
            </a>
            .
          </p>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight" id="badges">
            Badges
          </h3>
          <p className="mt-2">
            Below are examples of some snippets that you can use to link to
            doc.deno.land from your project website or README.{" "}
            <b>
              Don't forget to replace the doc.deno.land url with the one for
              your module.
            </b>
          </p>
          <img src="/badge.svg" alt="deno doc badge" className="mt-3" />
          <div className="mt-4">
            <span className="font-semibold text-lg">HTML</span>
            <CodeBlock
              language="html"
              value={`<a href="https://doc.deno.land/https/deno.land/std/fs/mod.ts"><img src="https://doc.deno.land/badge.svg" alt="deno doc"></a>`}
            />
          </div>
          <div className="mt-3">
            <span className="font-semibold text-lg">Markdown</span>
            <CodeBlock
              language="markdown"
              value={`[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/std/fs/mod.ts)`}
            />
          </div>
        </div>
        <div className="mt-12">
          <h3
            className="text-2xl font-semibold tracking-tight"
            id="limitations"
          >
            Limitations
          </h3>
          <div className="pt-2">
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
                The time to pull source files and generate documentation from
                these may not exceed 9 seconds. If you are running into a
                timeout issue because of this, please open an issue on{" "}
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
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-semibold tracking-tight" id="feedback">
            Feedback
          </h3>
          <p className="pt-2">
            On our{" "}
            <a href="https://github.com/denoland/doc_website" className="link">
              GitHub
            </a>{" "}
            you can open an issue to share any ideas, feature requests,
            questions, or issues you are having. For general discussion about
            Deno or doc.deno.land, please use our{" "}
            <a href="https://discord.gg/TGMHGv6" className="link">
              Discord server
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
