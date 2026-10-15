# CLAUDE.md

## Project

Customer web client for the orders API. Client-rendered single-page
application; no server code lives here. Package manager: npm.

## Canonical commands

| Purpose | Command |
|---|---|
| Build | `npm run build` |
| Lint | `npm run lint` |
| Unit and component tests | `npm test` |

There is no end-to-end, visual or automated accessibility suite.

## Architecture

```
src/
  main.js              # mount
  styles/tokens.css    # design tokens: colour, spacing, type, radius
  components/ui/       # shared building blocks — reuse before adding
  components/          # screens and feature components
  stores/              # client state (one store per domain)
  api/client.js        # the only place that calls the API
  auth/session.js      # sign-in and session handling
```

## Cross-cutting conventions

- Styling uses the custom properties in `src/styles/tokens.css`. No hard-coded
  colours, sizes or font weights in components.
- Form fields use `BaseField`; buttons use `BaseButton`.
- Data is fetched through a store action, never from a component directly.
- Supported browsers: the last two versions of the evergreen browsers. Phones
  are a first-class target down to 360px wide.
- Accessibility bar: WCAG 2.2 AA.

## High-risk paths

| Path | Why |
|---|---|
| `src/auth/` | Sign-in and session handling |

## Consumers

| Consumer | Repository | Audience | Owner |
|---|---|---|---|
| _(none — this is a leaf application)_ | | | |
