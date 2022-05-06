import type { Plugin } from "esbuild";

/**
 * Mark all URL imports as external so that the URL import is preserved in the build output.
 */
export const urlImportsPlugin = (): Plugin => {
  return {
    name: "url-imports",
    setup(build) {
      build.onResolve({ filter: /^https?:\/\// }, ({ path }) => {
        return { path, external: true };
      });
    },
  };
};
