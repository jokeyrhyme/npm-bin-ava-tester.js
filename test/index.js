'use strict'

const path = require('path')

const execa = require('execa')
const test = require('ava')

const tester = require('../lib/index.js')

const AVA_BIN = path.join(__dirname, '..', 'node_modules', '.bin', 'ava')

const NODE_PATH = path.join(__dirname, '..', 'node_modules')

test('exports a function', (t) => {
  t.is(typeof tester, 'function')
})

const failingFixtures = [
  'line-endings',
  'missing-file',
  'no-sha-bang'
]
if (process.platform.indexOf('win') !== 0) {
  failingFixtures.push('not-executable')
}
failingFixtures.forEach((fixture) => {
  test(
    `"${fixture}" fixture fails tests`,
    (t) => execa(AVA_BIN, [
      '--no-cache',
      'test/**/*.js'
    ], {
      cwd: path.join(__dirname, 'fixtures', fixture),
      env: { NODE_PATH }
    })
      .then(() => t.fail('unexpected pass'))
      .catch(() => t.pass('expected failure'))
  )
})

const passingFixtures = [
  'perfect'
]
if (process.platform.indexOf('win') === 0) {
  passingFixtures.push('not-executable')
}
passingFixtures.forEach((fixture) => {
  test(`"${fixture}" fixture passes all tests`, (t) => execa(AVA_BIN, [
    '--no-cache',
    'test/**/*.js'
  ], {
    cwd: path.join(__dirname, 'fixtures', fixture),
    env: { NODE_PATH }
  }))
})
