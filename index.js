'use strict'

import fp from 'fastify-plugin'

import { toNodeHandler } from 'better-auth/node'

export function mapHeaders(headers) {
  const entries = Object.entries(headers)
  const map = new Map()
  for (const [headerKey, headerValue] of entries) {
    if (headerValue != null) {
      map.set(headerKey, headerValue)
    }
  }
  return map
}

async function betterAuthPlugin(fastify, options) {
  await fastify.register(fastify => {
    const authHandler = toNodeHandler(options.auth)

    fastify.addContentTypeParser(
      'application/json',
      /* c8 ignore next 3 */
      (_request, _payload, done) => {
        done(null, null)
      }
    )

    fastify.all('/api/auth/*', async (request, reply) => {
      reply.raw.setHeaders(mapHeaders(reply.getHeaders()))
      await authHandler(request.raw, reply.raw)
    })
  })
}

export default fp(betterAuthPlugin, {
  fastify: '5.x',
  name: 'fastify-better-auth'
})
