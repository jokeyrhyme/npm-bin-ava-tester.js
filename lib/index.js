'use strict'

const fs = require('fs')
const path = require('path')

const execa = require('execa')
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
      if (process.platform.indexOf('win') !== 0) {
        t.notThrows(
          // Node >=6.3 uses fs.constants.X_OK, <6.3 uses fs.X_OK
          () => fs.accessSync(binPath, (fs.constants || fs).X_OK),
          `bin: { "${key}": "${pkg.bin[key]}" } (not executable)`
        )
      } else {
        t.pass(`skipping executable "${pkg.bin[key]}" test on Windows`)
      }
    })
  })

  test(`bin files are formatted correctly`, (t) => {
    Object.keys(pkg && pkg.bin || {}).forEach((key) => {
      const binPath = path.resolve(path.dirname(pkgPath), pkg.bin[key])
      const contents = fs.readFileSync(binPath, 'utf8')
      t.falsy(/\r/.test(contents), `CR (\\r) or CRLF (\\r\\n) line-ending found in ${binPath}`)

      const firstLine = contents.split('\n')[0] || ''
      t.truthy(firstLine, `first line of ${binPath} is empty`)
      t.truthy(/^#!\s*\/usr\/bin\/env\s+node$/.test(firstLine.trim()), `first line of ${binPath} is not "#!/usr/bin/env node"`)
    })
  })

  test(`bin files are valid JavaScript syntax`, () => {
    return Promise.all(
      Object.keys(pkg && pkg.bin || {})
        .map((key) => path.resolve(path.dirname(pkgPath), pkg.bin[key]))
        .map((binPath) => execa('node', [ '--check', binPath ]))
    )
  })
}
