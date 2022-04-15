interface ProcessEnv {
  NODE_ENV: "development" | "production" | "test";
}
interface Process {
  env: ProcessEnv;
}
var process: Process;
