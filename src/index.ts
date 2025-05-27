import fp from 'fastify-plugin';

import type { BetterAuthOptions, betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { mapHeaders } from './headers.ts';

const kAuth = Symbol('betterAuth');

type BetterAuthInstance<AuthOptions extends BetterAuthOptions> = ReturnType<
  typeof betterAuth<AuthOptions>
>;

export type FastifyBetterAuthOptions<AuthOptions extends BetterAuthOptions = BetterAuthOptions> = {
  auth: BetterAuthInstance<AuthOptions>;
};

/**
 * @param fastify Fastify instance
 * @returns Decorator for accessing the BetterAuth instance
 */
export function getAuthDecorator<AuthOptions extends BetterAuthOptions = BetterAuthOptions>(
  fastify: FastifyInstance,
): BetterAuthInstance<AuthOptions> {
  return fastify.getDecorator(kAuth);
}

async function fastifyBetterAuth(fastify: FastifyInstance, options: FastifyBetterAuthOptions) {
  fastify.decorate(kAuth, options.auth);

  await fastify.register((fastify) => {
    const authHandler = toNodeHandler(options.auth);

    fastify.addContentTypeParser(
      'application/json',
      /* c8 ignore next 3 */
      (_request, _payload, done) => {
        done(null, null);
      },
    );

    fastify.all('/api/auth/*', async (request, reply) => {
      reply.raw.setHeaders(mapHeaders(reply.getHeaders()));
      await authHandler(request.raw, reply.raw);
    });
  });
}

export default fp(fastifyBetterAuth, {
  fastify: '5.x',
  name: 'fastify-better-auth',
});
