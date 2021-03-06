# LDraw

[Documentation](docs/README.md)

## Issues

* `error An unexpected error occurred: "expected workspace package to exist for \"table\""`

    You need to downgrade your version of yarn so you can install...
    [Github issue](https://github.com/yarnpkg/yarn/issues/7734)
    ```
    yarn policies set-version 1.19.0
    ```


* `Oops! Something went wrong! :(`

    When adding packages to a subproject, it may be necessary to `yarn nuke`.  If you see the folowing:

    ```bash
    Oops! Something went wrong! :(

    ESLint: 7.11.0

    ESLint couldn't find the plugin "eslint-plugin-prettier".
    ```

    You should use workspace commands to add packages instead of changing directories to sub projects.

    ```
    yarn workspace ldraw-editor add react react-dom --dev
    ```

## Editor

```sh
yarn
npx http-server docs --cors
yarn start
```

# Typescript and WebPack

* /tsconfig.build.json - All tsbuilds eventually extend this file. Add your typescript changes to this file. This is the file that /tsconfig.json extends


@typescript-eslint/eslint-plugin
