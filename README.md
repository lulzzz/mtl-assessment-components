# Custom Elements for the Assessments POC

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This repo contains library of custom elements built with `@polymer/lit-element`.
Individual custom elements are found in `packages/*`.
[Lerna](https://lernajs.io/) is used to manage and publish individual components to NPM.

## Getting Started

```shell
# install the root dependencies
npm install
# install and link all dependencies for packages (bootstrap)
npm run bootstrap
# build all packages
npm run build
# watch for changes on all packages
npm run watch
# symlink together all packages that are dependencies of each other
npm run link-all
# delete node_modules directories for all packages
npm run clean
```

## Publish of new version of the packages

```shell
npm run publish
```

This is an interactive command line tool that lets you choose which version you want to publish.

## Other commands


```shell
# list all available packages
npm run list
# run unit tests for all packages
npm test
```

For details on available commands, check the [lerna documentation](https://github.com/lerna/lerna).
