import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
  schemaFile: './openapi.json',
  apiFile: './src/baseSplitApi.ts',
  apiImport: 'baseSplitApi',
  outputFile: './dist/openWhispererApi.ts',
  exportName: 'openWhispererApi',
  hooks: false
}

export default config
