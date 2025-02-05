'use strict'

import Fastify from 'fastify'
import plugin from '../../index.js'
import { betterAuth } from 'better-auth'

const auth = betterAuth({
  emailAndPassword: {
    enabled: true
  }
})

function buildApp(opts = {}) {
  const app = Fastify(opts)
  app.register(plugin, { auth })
  return app
}

export { buildApp }
