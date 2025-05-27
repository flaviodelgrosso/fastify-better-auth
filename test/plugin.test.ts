import assert from 'node:assert';
import { before, describe, test } from 'node:test';

import * as betterAuthNode from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { mapHeaders } from '../src/headers.ts';
import { getAuthDecorator } from '../src/index.ts';
import { buildApp } from './fixtures/app.ts';

describe('plugin tests', () => {
  let app: FastifyInstance;

  before(async () => {
    app = await buildApp();
  });

  test('should register successfully', async () => {
    assert.ok(app);
  });

  test('should have better-auth decorator', () => {
    const auth = getAuthDecorator(app);
    assert.ok(auth.api);
    assert.ok(auth.options);
  });

  test('should add content type parser', async () => {
    const contentTypeParser = app.hasContentTypeParser('application/json');
    assert.strictEqual(contentTypeParser, true);
  });

  test('should map headers correctly', () => {
    const headers = {
      'content-type': 'application/json',
      authorization: 'Bearer token',
      'x-custom-header': 'custom-value',
    };

    const result = mapHeaders(headers);

    assert.strictEqual(result.get('content-type'), 'application/json');
    assert.strictEqual(result.get('authorization'), 'Bearer token');
    assert.strictEqual(result.get('x-custom-header'), 'custom-value');
  });

  test('should ignore null or undefined header values', () => {
    const headers = {
      'content-type': 'application/json',
      authorization: undefined,
      'x-custom-header': undefined,
    };

    const result = mapHeaders(headers);

    assert.strictEqual(result.get('content-type'), 'application/json');
    assert.strictEqual(result.has('authorization'), false);
    assert.strictEqual(result.has('x-custom-header'), false);
  });

  test('should call better-auth node handler', async (t) => {
    t.mock.fn(betterAuthNode.toNodeHandler);

    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/get-session',
    });

    assert.strictEqual(response.statusCode, 200);
  });
});
