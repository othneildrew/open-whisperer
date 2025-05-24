import type { ConfigFile } from "@rtk-query/codegen-openapi";

const schemaFile = process.env.OPENAPI_ENDPOINT;

const config: ConfigFile = {
  schemaFile,
  apiFile: "./src/baseSplitApi.ts",
  apiImport: "baseSplitApi",
  outputFile: "./src/generated/openWhispererApi.ts",
  exportName: "api",
  hooks: true,
  flattenArg: true,
};

export default config;
