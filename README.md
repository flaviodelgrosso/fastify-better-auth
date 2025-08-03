# Fastify Better Auth

[![NPM version](https://img.shields.io/npm/v/fastify-better-auth.svg?style=flat)](https://www.npmjs.com/package/fastify-better-auth)
[![NPM downloads](https://img.shields.io/npm/dm/fastify-better-auth.svg?style=flat)](https://www.npmjs.com/package/fastify-better-auth)
[![CI](https://github.com/flaviodelgrosso/fastify-better-auth/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/flaviodelgrosso/fastify-better-auth/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/flaviodelgrosso/fastify-better-auth/graph/badge.svg?token=XF947FKO29)](https://codecov.io/gh/flaviodelgrosso/fastify-better-auth)

Fastify Better Auth is a Fastify plugin that simplifies the integration of the [Better Auth](https://www.better-auth.com) library into your Fastify applications. This plugin automatically registers authentication routes and provides utilities to access the auth instance and session data in your application.

## Features

- 🚀 Easy integration with Better Auth
- 🛡️ Automatic route registration for authentication endpoints
- 🔧 Type-safe decorator access to auth instance
- ⚡ Compatible with Fastify 5.x and Better Auth 1.x

## Requirements

- Fastify 5.x
- Better Auth 1.x

## Installation

```bash
npm install fastify-better-auth
```

## Quick Start

### 1. Create the Better Auth instance

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  trustedOrigins: [process.env.AUTH_URL],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### 2. Register the plugin

#### Option 1: Using fastify-plugin

```typescript
import type { FastifyInstance } from 'fastify';
import FastifyBetterAuth from 'fastify-better-auth';
import fp from 'fastify-plugin';
import { auth } from './auth.js';

async function authPlugin(fastify: FastifyInstance) {
  await fastify.register(FastifyBetterAuth, { auth });
}

export default fp(authPlugin, {
  name: 'auth-plugin',
});
```

#### Option 2: Using Fastify Autoload

```typescript
import FastifyBetterAuth, { type FastifyBetterAuthOptions } from 'fastify-better-auth';
import { auth } from './auth.js';

export const autoConfig: FastifyBetterAuthOptions = {
  auth
};

export default FastifyBetterAuth;
```

### 3. Start using authentication

Once registered, the plugin automatically creates authentication routes under `/api/auth/*` and decorates your Fastify instance with the auth utilities.

## API Reference

### Plugin Options

```typescript
interface FastifyBetterAuthOptions<AuthOptions extends BetterAuthOptions = BetterAuthOptions> {
  auth: BetterAuthInstance<AuthOptions>;
}
```

- `auth`: A Better Auth instance created with `betterAuth()`

### Available Routes

The plugin automatically registers the following authentication routes:

- `POST /api/auth/sign-in` - Sign in with email/password
- `POST /api/auth/sign-up` - Create a new account
- `POST /api/auth/sign-out` - Sign out the current user
- `GET /api/auth/session` - Get current session
- And all other Better Auth endpoints...

## Advanced Usage

### Accessing the Better Auth Instance

When registering the plugin, it decorates the Fastify instance with the Better Auth instance. You can use `getAuthDecorator()` to access the auth instance in your routes or hooks.

> **Note:** `getDecorator` API provided by Fastify is the recommended way instead of using module augmentation. `getAuthDecorator()` is a wrapper around it and is generic and type-safe. It's recommended to use it with the type of the auth options you passed to the auth instance, especially if you're using plugins that extend the auth instance with additional methods.

```typescript
import { getAuthDecorator } from 'fastify-better-auth';
import type { FastifyInstance } from 'fastify';

// In your route handler
fastify.get('/protected', async (request, reply) => {
  const auth = getAuthDecorator<typeof authOptions>(fastify);
  // Use auth.api methods here
});
```

### Session Management

Here's how to create an authentication hook to protect routes and access session data:

```typescript
import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance } from 'fastify';
import { getAuthDecorator } from 'fastify-better-auth';
import { auth } from './auth.js';

async function authHook(fastify: FastifyInstance) {
  // Decorate the request with session
  fastify.decorateRequest('session');

  fastify.addHook('onRequest', async (request, reply) => {
    const authInstance = getAuthDecorator<typeof auth.options>(fastify);
    const session = await authInstance.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session?.user) {
      return reply.unauthorized('You must be logged in to access this resource.');
    }

    request.setDecorator('session', session);
  });
}

export default authHook;
```

## Examples

### Basic Authentication Route

```typescript
import type { FastifyInstance } from 'fastify';
import { getAuthDecorator } from 'fastify-better-auth';

export default async function routes(fastify: FastifyInstance) {
  // Public route
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  // Protected route
  fastify.get('/profile', {
    preHandler: async (request, reply) => {
      const auth = getAuthDecorator(fastify);
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session?.user) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      request.user = session.user;
    }
  }, async (request) => {
    return { user: request.user };
  });
}
```

### Complete Example

You can find a complete working example in the [fastify-forge](https://github.com/flaviodelgrosso/fastify-forge) template, which demonstrates:

- Full authentication setup
- Protected routes
- Session management
- Production-ready configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build the project: `npm run build`

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
