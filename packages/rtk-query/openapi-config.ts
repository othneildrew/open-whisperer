import type { ConfigFile } from '@rtk-query/codegen-openapi'

const schemaFile = 'http://localhost:8000/openapi.json';

const config: ConfigFile = {
  schemaFile,
  apiFile: './src/baseSplitApi.ts',
  apiImport: 'baseSplitApi',
  outputFile: './dist/openWhispererApi.ts',
  exportName: 'openWhispererApi',
  hooks: true,
  endpointOverrides: [
    {
      pattern: 'transcribeFile',
      type: 'query',
    }
  ],
}

export default config
