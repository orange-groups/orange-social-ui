import assert from 'node:assert/strict'
import fs from 'node:fs'

function flatten(value, prefix = '') {
  return Object.fromEntries(Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof entry === 'string' ? [[path, entry]] : Object.entries(flatten(entry, path))
  }))
}
for (const namespace of ['common', 'auth', 'landing', 'home', 'social']) {
  const read = language => flatten(JSON.parse(fs.readFileSync(new URL(`../src/i18n/locales/${language}/${namespace}.json`, import.meta.url), 'utf8')))
  const vi = read('vi')
  const en = read('en')
  assert.deepEqual(Object.keys(vi).sort(), Object.keys(en).sort(), `${namespace}: VI and EN must have identical keys`)
  for (const key of Object.keys(vi)) {
    assert.ok(vi[key].trim() && en[key].trim(), `${namespace}.${key}: empty translation`)
    const variables = value => [...value.matchAll(/{{\s*(\w+)\s*}}/g)].map(match => match[1]).sort()
    assert.deepEqual(variables(vi[key]), variables(en[key]), `${namespace}.${key}: interpolation variables differ`)
  }
  console.log(`PASS ${namespace}: ${Object.keys(vi).length} matching VI/EN entries`)
}
const themeKeys = theme => [...fs.readFileSync(new URL(`../src/styles/themes/${theme}.css`, import.meta.url), 'utf8').matchAll(/(--color-[\w-]+):/g)].map(match => match[1]).sort()
assert.deepEqual(themeKeys('light'), themeKeys('dark'), 'Light/dark token contracts differ')
console.log(`PASS themes: ${themeKeys('light').length} matching light/dark tokens`)
