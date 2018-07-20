import pkg from './package.json';

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import del from 'rollup-plugin-delete';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

const outputBasename = `${pkg.name}-${pkg.version}`;

export default [{
    input: 'src/main.js',
    output: {
      name: 'ImgixOptimizer',
      file: `dist/${outputBasename}.js`,
      format: 'iife'
    },
    plugins: [
      del({ targets: ['dist/imgix-optimizer*', 'vendor/assets/javascripts/*.js'] }),
      resolve(),
      commonjs(),
      babel({ exclude: 'node_modules/**' })
    ]
  },
  // --- MINIFIED ---
  {
    input: 'src/main.js',
    output: {
      name: 'ImgixOptimizer',
      file: `dist/${outputBasename}.min.js`,
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
