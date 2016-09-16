# npm-bin-ava-tester.js [![npm](https://img.shields.io/npm/v/npm-bin-ava-tester.svg?maxAge=2592000)](https://www.npmjs.com/package/npm-bin-ava-tester) [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/github/jokeyrhyme/npm-bin-ava-tester-js?branch=master&svg=true)](https://ci.appveyor.com/project/jokeyrhyme/npm-bin-ava-tester-js) [![Travis CI Status](https://travis-ci.org/jokeyrhyme/npm-bin-ava-tester.js.svg?branch=master)](https://travis-ci.org/jokeyrhyme/npm-bin-ava-tester.js)

ready-to-use ava tests for CLIs written with Node.js and NPM


## What is this?

I designed this package for use with CLIs that are:

-   written in [Node.js](https://nodejs.org/)

-   published to [NPM](https://www.npmjs.com/)

-   already tested (or otherwise compatible) with [ava](https://github.com/avajs/ava)

This package exports a single function that conveniently initialises some basic tests for you to ensure that:

-   you have at least a basic package.json file

-   your package.json file has valid "bin" references

-   your "bin" files all exist and are executable

-   your "bin" files all use UNIX-style LF line-endings, not CR or CRLF

-   your "bin" files all start with `#! /usr/bin/env node`


## Usage

Example ava test file:

```js
const test = require('ava')
const npmBinTester = require('npm-bin-ava-tester')

npmBinTester(test)
```

That's it!
