import typescript from '@rollup/plugin-typescript';
import ignoreBlocksPlugin from './rollup/rollup-plugin-ignore.js';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.cjs',
    format: "cjs",
  },
  plugins: [
    ignoreBlocksPlugin(),
    resolve({
      extensions: ['.js', '.ts']
    }),
    json(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json', // Path to your tsconfig.json
      sourceMap: true,
    }),
  ],
};