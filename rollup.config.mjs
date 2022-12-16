import typescript from '@rollup/plugin-typescript';

export default {
  input: './packages/vue/src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'packages/vue/dist/simple-vue3-model.cjs.js',
    },
    {
      format: 'es',
      file: 'packages/vue/dist/simple-vue3-model.esm.js',
    },
  ],

  plugins: [typescript()],
};
