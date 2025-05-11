# Fastify Better Auth

[![NPM
version](https://img.shields.io/npm/v/fastify-better-auth.svg?style=flat)](https://www.npmjs.com/package/fastify-better-auth)
[![NPM
downloads](https://img.shields.io/npm/dm/fastify-better-auth.svg?style=flat)](https://www.npmjs.com/package/fastify-better-auth)
[![CI](https://github.com/flaviodelgrosso/fastify-better-auth/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/flaviodelgrosso/fastify-better-auth/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/flaviodelgrosso/fastify-better-auth/graph/badge.svg?token=XF947FKO29)](https://codecov.io/gh/flaviodelgrosso/fastify-better-auth)

Fastify Better Auth is a Fastify plugin that simplifies the integration of the [Better Auth](https://www.better-auth.com) library into your Fastify applications. This plugin allows you to easily register authentication routes using Better Auth, providing a seamless authentication experience.

## Install

```bash
npm install fastify-better-auth
```

### Usage

#### Create the Better Auth instance

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  trustedOrigins: [env.auth.URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

#### Register the plugin

```typescript
import type { FastifyInstance } from 'fastify';
import FastifyBetterAuth from 'fastify-better-auth';
import fp from 'fastify-plugin';
import auth from './auth.ts';

declare module 'fastify' {
  export interface FastifyInstance {
    auth: typeof auth;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorate('auth', auth);
  await fastify.register(FastifyBetterAuth, { auth });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});

```

### Accessing the Better Auth instance or Session object

If you want to access the auth instance and session you can define an authentication hook like this.
You can try a working example in my [fastify-forge](https://github.com/flaviodelgrosso/fastify-forge) template.

```typescript
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import auth, { type Session } from './auth.ts';

declare module 'fastify' {
  interface FastifyRequest {
    session: Session;
  }
}

async function authHook(fastify: FastifyInstance) {
  fastify.decorateRequest('session');

  fastify.addHook('preHandler', async (req, res) => {
    const session = await fastify.auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.unauthorized('You must be logged in to access this resource.');
    }

    req.session = session;
  });
}

export default authHook;
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
