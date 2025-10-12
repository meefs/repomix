import { defineConfig } from '../../../src/index.js';

export default defineConfig({
  output: {
    filePath: 'mts-output.xml',
    style: 'xml',
  },
  ignore: {
    customPatterns: ['**/test/**'],
  },
});
