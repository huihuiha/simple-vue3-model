import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: [
      {
        find: /@simple-vue3-model\/(\w*)/,
        replacement: path.resolve(__dirname, 'packages') + '/$1/src',
      },
    ],
  },
});
