import { describe, test, before } from 'node:test'
import { buildApp } from './fixtures/app.js'
import { mapHeaders } from '../index.js'
import * as betterAuthNode from 'better-auth/node'

describe('plugin tests', () => {
  let app

  before(() => {
    app = buildApp()
  })

  test('should register successfully', async t => {
    t.assert.ok(app)
  })

  test('should add content type parser', async t => {
    const contentTypeParser = app.hasContentTypeParser('application/json')
    t.assert.strictEqual(contentTypeParser, true)
  })

  test('should map headers correctly', t => {
    const headers = {
      'content-type': 'application/json',
      authorization: 'Bearer token',
      'x-custom-header': 'custom-value'
    }

    const result = mapHeaders(headers)

    t.assert.strictEqual(result.size, 3)
    t.assert.strictEqual(result.get('content-type'), 'application/json')
    t.assert.strictEqual(result.get('authorization'), 'Bearer token')
    t.assert.strictEqual(result.get('x-custom-header'), 'custom-value')
  })

  test('should ignore null or undefined header values', t => {
    const headers = {
      'content-type': 'application/json',
      authorization: null,
      'x-custom-header': undefined
    }

    const result = mapHeaders(headers)

    t.assert.strictEqual(result.size, 1)
    t.assert.strictEqual(result.get('content-type'), 'application/json')
    t.assert.strictEqual(result.has('authorization'), false)
    t.assert.strictEqual(result.has('x-custom-header'), false)
  })

  test('should call better-auth node handler', async t => {
    t.mock.fn(betterAuthNode.toNodeHandler)

    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/get-session'
    })

    t.assert.strictEqual(response.statusCode, 200)
  })
})
