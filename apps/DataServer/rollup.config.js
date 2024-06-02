import typescript from '@rollup/plugin-typescript';
import ignoreBlocksPlugin from './rollup/rollup-plugin-ignore.js';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.cjs',
    format: 'cjs',
  },
  plugins: [
    typescript(),
    ignoreBlocksPlugin(),
  ],
};