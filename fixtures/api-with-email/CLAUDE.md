# CLAUDE.md

## Project

Orders API. A NestJS service that accepts orders and sends transactional email
about them. Orders are held in process memory; there is no database. Package
manager: npm.

## Canonical commands

| Purpose | Command |
|---|---|
| Build | `npm run build` |
| Lint | `npm run lint` |
| Unit tests | `npm test` |

There is no email rendering or preview step in CI.

## Architecture

```
src/
  main.ts                    # bootstrap
  orders/                    # controller, service, in-memory store
  mail/mail.service.ts       # renders a template pair and sends it
  mail/templates/*.hbs       # HTML part
  mail/templates/*.txt.hbs   # plain-text part — every email has both
```

## Cross-cutting conventions

- Errors: throw the framework's HTTP exceptions; the global filter shapes them
  as `{ error: { code, message } }`.
- Validation: request bodies are DTO classes checked by the global validation
  pipe.
- Email templates use the table layout and inline styles of
  `order-confirmation.hbs`; they are read in desktop, web and mobile mail
  clients, some of which strip `<style>` blocks. Values are interpolated with
  `{{ }}`, which escapes; triple braces are not used.
- Links in email are absolute and built from `APP_BASE_URL`.

## High-risk paths

| Path | Why |
|---|---|
| `src/mail/` | Content sent to customers' inboxes cannot be recalled |

## Consumers

| Consumer | Repository | Audience | Owner |
|---|---|---|---|
| Customer web client | web-client | Public | Web team |
