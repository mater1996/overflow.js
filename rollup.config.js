import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import { uglify } from 'rollup-plugin-uglify';
import uglifyes from 'rollup-plugin-uglify-es';

const production = !process.env.ROLLUP_WATCH;

const babelOption = {
  presets: [
    [
      '@babel/env',
      {
        modules: 'false',
        targets: {
          browsers: '> 1%, IE 11, not op_mini all, not dead',
          node: 8
        }
      }
    ]
  ],
  exclude: 'node_modules/**'
}

export default [
  {
    input: 'src/ellipsis-text.js',
    output: {
      name: 'EllipsisText',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      babel(babelOption),
      commonjs(),
      (production && uglify()),
    ]
  },
  {
    input: 'src/ellipsis-text.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel(babelOption),
      (production && uglifyes()),
    ]
  }
]
