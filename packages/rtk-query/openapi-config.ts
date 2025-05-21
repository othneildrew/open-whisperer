import type { ConfigFile } from '@rtk-query/codegen-openapi'

const schemaFile = 'http://localhost:8000/openapi.json';

const config: ConfigFile = {
  schemaFile,
  apiFile: './src/baseSplitApi.ts',
  apiImport: 'baseSplitApi',
  outputFile: './src/generated/openWhispererApi.ts',
  exportName: 'openWhispererApi',
  hooks: true,
  flattenArg: true,
}

export default config
