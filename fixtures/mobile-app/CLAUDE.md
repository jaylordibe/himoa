# CLAUDE.md

## Project

Customer mobile app for the orders API, built once for iOS and Android with
Expo and React Native. Package manager: npm.

## Canonical commands

| Purpose | Command |
|---|---|
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit and component tests | `npm test` |

Device and simulator runs are manual; there is no automated device suite.

## Architecture

```
App.js                 # navigation container and stack
src/theme.js           # colours, spacing, type scale, minimum touch target
src/components/        # Screen (safe areas + keyboard), PrimaryButton
src/screens/           # one file per screen
src/hooks/useOnline.js # the connectivity signal every screen uses
src/api/client.js      # the only place that calls the API
src/auth/token.js      # session token, kept in the platform secure store
```

## Cross-cutting conventions

- Every screen renders inside `Screen`, which owns safe areas and keyboard
  avoidance.
- Colours, spacing and type come from `src/theme.js`. Touch targets are at least
  `theme.minTouchTarget`.
- Screens read connectivity from `useOnline()` and show the offline banner
  instead of firing requests that cannot succeed.
- Lists use `FlatList`.
- Accessibility: every touchable has an `accessibilityLabel` and an
  `accessibilityRole`; text respects the system font scale.

## High-risk paths

| Path | Why |
|---|---|
| `src/auth/` | Session token storage |

## Consumers

| Consumer | Repository | Audience | Owner |
|---|---|---|---|
| _(none — this is a leaf application)_ | | | |
