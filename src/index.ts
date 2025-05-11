import fp from 'fastify-plugin';

import type { BetterAuthOptions, betterAuth } from 'better-auth';
import { toNodeHandler } from 'better-auth/node';
import type { FastifyInstance, FastifyReply } from 'fastify';

export type FastifyBetterAuthOptions<AuthOptions extends BetterAuthOptions = BetterAuthOptions> = {
  auth: ReturnType<typeof betterAuth<AuthOptions>>;
};

async function fastifyBetterAuth(fastify: FastifyInstance, options: FastifyBetterAuthOptions) {
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

type HttpHeaders = Partial<ReturnType<FastifyReply['getHeaders']>>;

export function mapHeaders(fastifyHeaders: HttpHeaders) {
  const headers = new Headers();
  Object.entries(fastifyHeaders).forEach(([key, value]) => {
    if (value) headers.append(key, value.toString());
  });

  return headers;
}

export default fp(fastifyBetterAuth, {
  fastify: '5.x',
  name: 'fastify-better-auth',
});
