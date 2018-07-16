import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'ImgixOptimizer',
      file: `dist/${pkg.name}-${pkg.version}.js`,
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({ exclude: 'node_modules/**' }),
      uglify()
    ]
  }
];
