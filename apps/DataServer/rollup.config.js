import typescript from '@rollup/plugin-typescript';
import ignoreBlocksPlugin from './rollup/rollup-plugin-ignore.js';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
  plugins: [
    typescript(),
    ignoreBlocksPlugin(),
  ],
};