'use strict'

const findUp = require('find-up')

module.exports = function (test) {
  const pkgPath = findUp.sync('package.json')

  test('package.json found', (t) => {
    t.truthy(pkgPath)
  })

  test('package.json is JSON, and specifies Object', (t) => {
    const pkg = require(pkgPath)
    t.truthy(pkg)
    t.is(typeof pkg, 'object')
  })

  test('package.json has non-empty "bin" section', (t) => {
    const pkg = require(pkgPath)
    t.truthy(pkg.bin)
    t.is(typeof pkg.bin, 'object')
    t.truthy(Object.keys(pkg.bin).length)
  })
}
