import type { FastifyReply } from 'fastify';

type HttpHeaders = Partial<ReturnType<FastifyReply['getHeaders']>>;

/**
 * @internal
 */
export function mapHeaders(fastifyHeaders: HttpHeaders) {
  const headers = new Headers();
  Object.entries(fastifyHeaders).forEach(([key, value]) => {
    if (value) headers.append(key, value.toString());
  });

  return headers;
}
