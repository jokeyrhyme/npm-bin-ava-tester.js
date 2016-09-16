'use strict'

const fs = require('fs')
const path = require('path')

const execa = require('execa')
const test = require('ava')

const tester = require('../lib/index.js')

const AVA_BIN = path.join(__dirname, '..', 'node_modules', '.bin', 'ava')

test.before(() => {
  const NODE_MODULES = path.join(__dirname, '..', 'node_modules')
  try {
    fs.symlinkSync(NODE_MODULES, path.join(__dirname, 'fixtures', 'perfect', 'node_modules'))
  } catch (err) {
    if (err.code === 'EEXIST') {
      return // it's okay if the symlink already exists
    }
    throw err
  }
})

test('exports a function', (t) => {
  t.is(typeof tester, 'function')
})

test('"perfect" fixtures passes all tests', (t) => execa(AVA_BIN, [
  '--no-cache',
  'test/**/*.js'
], {
  cwd: path.join(__dirname, 'fixtures', 'perfect')
}))
