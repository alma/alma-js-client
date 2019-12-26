import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import {uglify} from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer';


const pkg = require('./package.json');

const libraryName = 'alma-js-client';

const baseConfig = {
  input: `src/${libraryName}.ts`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({useTsconfigDeclarationDir: true}),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({jsnext: true, preferBuiltins: true, browser: true}),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Resolve source maps to the original source
    sourceMaps(),
  ],
};

export default [
  {
    ...baseConfig,
    output: [
      {file: pkg.main, name: 'Alma', format: 'umd', sourcemap: true},
      {file: pkg.module, format: 'es', sourcemap: true},
    ],
  },
  {
    ...baseConfig,
    output: [
      {file: pkg.min, name: 'Alma', format: 'umd', sourcemap: true},
    ],
    plugins: [
      ...baseConfig.plugins,
      uglify(),
      visualizer()
    ]
  }
]
