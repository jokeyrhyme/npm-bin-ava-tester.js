'use strict'

const fs = require('fs')
const path = require('path')

const findUp = require('find-up')

module.exports = function (test) {
  let pkgPath, pkg

  test.before(() => {
    pkgPath = findUp.sync('package.json')
    try {
      pkg = require(pkgPath)
    } catch (err) {
      // do nothing
    }
  })

  test('package.json found', (t) => {
    t.truthy(pkgPath, 'package.json not found')
  })

  test('package.json is JSON, and specifies Object', (t) => {
    t.truthy(pkg, 'package.json not JSON')
    t.is(typeof pkg, 'object', 'package.json not JSON Object')
  })

  test('package.json has non-empty "bin" section', (t) => {
    t.truthy(pkg.bin, 'missing "bin" section')
    t.is(typeof pkg.bin, 'object', 'invalid "bin" section')
    t.truthy(Object.keys(pkg.bin).length, '"bin" section empty')
  })

  test(`bin files exist and are executable`, (t) => {
    Object.keys(pkg && pkg.bin || {}).forEach((key) => {
      const binPath = path.resolve(path.dirname(pkgPath), pkg.bin[key])
      t.notThrows(
        () => fs.accessSync(binPath),
        `bin: { "${key}": "${pkg.bin[key]}" } (not readable)`
      )
      t.notThrows(
        () => fs.accessSync(binPath, fs.constants.X_OK),
        `bin: { "${key}": "${pkg.bin[key]}" } (not executable)`
      )
    })
  })
}
