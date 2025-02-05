import { betterAuth } from 'better-auth'
import type { FastifyPluginAsync } from 'fastify'

declare namespace fastifyBetterAuth {
  type FastifyBetterAuthOptions = {
    auth: ReturnType<typeof betterAuth>
  }

  export const fastifyBetterAuth: FastifyBetterAuth

  export { fastifyBetterAuth as default, FastifyBetterAuthOptions }
}

type FastifyBetterAuth =
  FastifyPluginAsync<fastifyBetterAuth.FastifyBetterAuthOptions>

declare function fastifyBetterAuth(
  ...params: Parameters<FastifyBetterAuth>
): ReturnType<FastifyBetterAuth>

export = fastifyBetterAuth
