import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import pkg from './package.json';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'ImgixOptimizer',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      serve('dist')
    ]
  }
];
