import "./modules";

export type { AppConfig } from "./config";

export * as cli from "./cli/index";
export { createApp } from "./cli/create";

export type { AssetsManifest } from "./compiler/assets";
export { getDependenciesToBundle } from "./compiler/dependencies";
