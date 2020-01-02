import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default [
  {
    input: 'src/overflow.js',
    output: {
      name: 'Overflow',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'src/overflow.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
]
