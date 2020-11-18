module.exports = {
  settings: {
    react: {
      version: 'detect',

      // What is this used for?
      // linkComponents: [
      //   // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      //   'Hyperlink',
      //   { name: 'Link', linkAttribute: 'to' },
      // ],
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
