module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }, // Do we need this?
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],

  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '^ldraw$': '../ldraw/src',
          '^react-ldraw$': '../react-ldraw/src',
        },
      },
    ],
  ],
};
