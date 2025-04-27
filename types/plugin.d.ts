import type { betterAuth, BetterAuthOptions } from 'better-auth'
import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    auth: fastifyBetterAuth.FastifyBetterAuthOptions['auth']
  }
}

declare namespace fastifyBetterAuth {
  type FastifyBetterAuthOptions<AuthOptions extends BetterAuthOptions> = {
    auth: ReturnType<typeof betterAuth<AuthOptions>>
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
