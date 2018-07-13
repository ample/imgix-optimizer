import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'ImgixOptimizer',
      file: pkg.browser,
      format: 'iife'
    },
    plugins: [
      resolve(),
      babel({ exclude: 'node_modules/**' }),
      // commonjs(),
      serve('dist')
    ]
  }
];
