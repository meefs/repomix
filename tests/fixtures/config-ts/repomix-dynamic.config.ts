import { defineConfig } from '../../../src/index.js';

const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
const environment = process.env.NODE_ENV || 'development';

export default defineConfig({
  output: {
    filePath: `output-${environment}-${timestamp}.xml`,
    style: 'xml',
  },
  ignore: {
    customPatterns: ['**/node_modules/**'],
  },
});
