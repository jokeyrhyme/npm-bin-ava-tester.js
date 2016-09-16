'use strict'

const fs = require('fs')
const path = require('path')

const execa = require('execa')
const test = require('ava')

const tester = require('../lib/index.js')

const AVA_BIN = path.join(__dirname, '..', 'node_modules', '.bin', 'ava')

test.before(() => {
  const NODE_MODULES = path.join(__dirname, '..', 'node_modules')
  const fixtures = [ 'missing-file', 'not-executable', 'perfect' ]
  fixtures.forEach((fixture) => {
    const fixturePath = path.join(__dirname, 'fixtures', fixture)
    try {
      fs.symlinkSync(NODE_MODULES, path.join(fixturePath, 'node_modules'))
    } catch (err) {
      if (err.code === 'EEXIST') {
        return // it's okay if the symlink already exists
      }
      throw err
    }
  })
})

test('exports a function', (t) => {
  t.is(typeof tester, 'function')
})

const failingFixtures = [ 'missing-file', 'not-executable' ]
failingFixtures.forEach((fixture) => {
  test(
    `"${fixture}" fixture fails tests`,
    (t) => execa(AVA_BIN, [
      '--no-cache',
      'test/**/*.js'
    ], {
      cwd: path.join(__dirname, 'fixtures', fixture)
    })
      .then(() => t.fail('unexpected pass'))
      .catch(() => t.pass('expected failure'))
  )
})

test('"perfect" fixture passes all tests', (t) => execa(AVA_BIN, [
  '--no-cache',
  'test/**/*.js'
], {
  cwd: path.join(__dirname, 'fixtures', 'perfect')
}))
