module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true, //https://web.dev/serve-modern-code-to-modern-browsers/
        targets: { node: 'current' },
      }, // Do we need this?
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],

  // plugins: [
  //   [
  //     'module-resolver',
  //     {
  //       alias: {
  //         '^common$': '../common/src',
  //       },
  //     },
  //   ],
  // ],
};
