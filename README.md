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

```javascript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import FastifyBetterAuth from 'fastify-better-auth';
import fp from 'fastify-plugin';

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

async function authPlugin(fastify) {
  await fastify.register(FastifyBetterAuth, { auth });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
