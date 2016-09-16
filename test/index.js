'use strict'

const test = require('ava')

const tester = require('../lib/index.js')

test((t) => {
  t.is(typeof tester, 'function')
})
