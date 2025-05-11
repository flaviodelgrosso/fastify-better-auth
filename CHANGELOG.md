# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.3](https://github.com/flaviodelgrosso/fastify-better-auth/compare/v1.0.2...v1.0.3) (2025-05-11)

* removed Fastify module augmentation for the better-auth instance. This was causing issues with the correct inference of additional plugins passed to the betterAuth options. The recommended way now is to create a fastify hook where to define the decorator passing the `typeof` of your betterAuth instance. Check [here](https://github.com/flaviodelgrosso/fastify-better-auth?tab=readme-ov-file#accessing-the-better-auth-instance-or-session-object) for more details. We will add a better way to do this in the future.

### [1.0.2](https://github.com/flaviodelgrosso/fastify-better-auth/compare/v1.0.1...v1.0.2) (2025-04-27)

### Bug Fixes

* **types:** update FastifyBetterAuthOptions to use generic BetterAuthOptions ([b8b052e](https://github.com/flaviodelgrosso/fastify-better-auth/commit/b8b052e55e9f3e5a9ee01b6d41be8a1f7065ef1f))

### [1.0.1](https://github.com/flaviodelgrosso/fastify-better-auth/compare/v1.0.0...v1.0.1) (2025-02-21)

### Features

* add auth instance access decorator ([068c60d](https://github.com/flaviodelgrosso/fastify-better-auth/commit/068c60dafe446ec191ef50ae30f76ad04cefd05b))

## 1.0.0 (2025-02-05)
