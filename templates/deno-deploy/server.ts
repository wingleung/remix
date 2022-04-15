import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
// Import path interpreted by the Remix compiler
import * as build from "@remix-run/dev/server-build";

// Temporary: in the future, import from `@remix-run/deno` at some URL
import type { ServerBuild } from "./remix-deno/index.ts";
import { createRequestHandler, serveStaticFiles } from "./remix-deno/index.ts";

export function createDenoDeployRequestHandler<Context = unknown>({
  build,
  mode,
  getLoadContext,
  staticFiles = {
    publicDir: "./public",
    assetsPublicPath: "/build/",
  },
}: {
  build: ServerBuild;
  mode?: string;
  getLoadContext?: (request: Request) => Promise<Context> | Context;
  staticFiles?: {
    cacheControl?: string | ((url: URL) => string);
    publicDir?: string;
    assetsPublicPath?: string;
  };
}) {
  let remixHandler = createRequestHandler({ build, mode, getLoadContext });

  return async (request: Request) => {
    try {
      return await serveStaticFiles(request, staticFiles);
    } catch (error) {
      let isDirectory =
        error.code === "EISDIR" ||
        // Deno Deploy throws an error without an error code
        // so look in the error message instead
        error.message?.contains?.("Is a directory");
      if (isDirectory || error.code !== "ENOENT") {
        return remixHandler(request);
      }
      throw error;
    }
  };
}

const remixHandler = createDenoDeployRequestHandler({
  build,
  // process.env.NODE_ENV is provided by Remix at compile time
  mode: process.env.NODE_ENV,
  getLoadContext: () => ({}),
});

const port = Number(Deno.env.get("PORT")) || 8000;
console.log(`Listening on http://localhost:${port}`);
serve(remixHandler, { port });
