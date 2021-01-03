import pkg from './package.json';
import typescript from '@wessberg/rollup-plugin-ts';
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
    input: ['src/index.ts'],
    output: [
      {
        ...common,
        dir: 'lib',
        format: 'esm',
      },
      {
        ...common,
        file: 'lib/cjs/index.js',
        format: 'cjs',
      },
      {
        ...common,
        file: 'lib/ldraw.min.js',
        format: 'umd',
        name: 'LDRAW',
        esModule: false,
        plugins: [terser()],
      },
      {
        ...common,
        file: 'lib/ldraw.js',
        format: 'umd',
        name: 'LDRAW',
        esModule: false,
      },
    ],
    plugins: [typescript({ tsconfig: 'tsconfig.build.json' })],
  },

  {
    input: ['src/loaders/index.ts'],
    external: ['fs/promises', 'path'],
    output: [
      {
        ...common,
        file: 'lib/loaders/index.js',
        format: 'esm',
      },
      {
        ...common,
        file: 'lib/cjs/loaders/index.js',
        format: 'cjs',
      },
    ],
    plugins: [typescript({ tsconfig: 'tsconfig.build.json' })],
  },
];
