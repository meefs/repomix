import { defineConfig } from '../../../src/index.js';

export default defineConfig({
  output: {
    filePath: 'cts-output.xml',
    style: 'plain',
  },
  ignore: {
    customPatterns: ['**/build/**'],
  },
});
