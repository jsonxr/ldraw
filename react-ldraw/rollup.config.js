import pkg from './package.json';
import typescript from '@wessberg/rollup-plugin-ts';

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
    external: ['ldraw', 'react'],
    output: [
      {
        ...common,
        dir: 'lib',
        format: 'esm',
      },
    ],
    plugins: [typescript({ tsconfig: 'tsconfig.build.json' })],
  },
];
