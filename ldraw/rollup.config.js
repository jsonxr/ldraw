import pkg from './package.json';
import typescript from '@wessberg/rollup-plugin-ts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const common = {
  sourcemap: true,
  banner: `
// ${pkg.name}: ${pkg.version}
// Copyright © 2021 Jason Rowland

`,
};

export default [
  {
    input: ['src/node/index.ts'],
    external: ['fs/promises', 'path'],
    output: [
      {
        ...common,
        //dir: 'lib',
        file: 'lib/index.js',
        format: 'esm',
      },
      {
        ...common,
        file: 'lib/cjs/index.js',
        format: 'cjs',
      },
    ],
    plugins: [typescript({ tsconfig: 'tsconfig.build.json' })],
  },

  {
    input: ['src/browser/index.ts'],
    output: [
      {
        ...common,
        file: 'lib/ldraw.js',
        format: 'esm',
      },
      {
        ...common,
        file: 'lib/ldraw.umd.js',
        format: 'umd',
        name: 'LDRAW',
        esModule: false,
      },
      {
        ...common,
        file: 'lib/ldraw.umd.min.js',
        format: 'umd',
        name: 'LDRAW',
        esModule: false,
        plugins: [terser()],
      },
    ],
    plugins: [typescript({ tsconfig: 'tsconfig.build.json' }), nodeResolve()],
  },
];
