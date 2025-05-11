import { betterAuth } from 'better-auth';
import Fastify from 'fastify';
import plugin from '../../src/index.ts';

const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
});

async function buildApp(opts = {}) {
  const app = Fastify(opts);
  await app.register(plugin, { auth });
  return app;
}

export { buildApp };
