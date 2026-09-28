---
fixture: fixtures/nestjs-api
graders: [security-risk-recognition, no-stack-assumption, efficiency-discipline]
tags: [security, exposure, restraint, efficiency]
---

Our API logs are full of requests like these from a handful of IPs — thousands a
day, all answered 404:

```
GET /phpinfo.php
GET /admin/phpinfo.php
GET /phpmyadmin/index.php
GET /.env
GET /.aws/credentials
GET /config/secrets.json
```

Are we vulnerable? What should we do about it?

<!--
What this case is for — recognising a probe without mistaking it for a
vulnerability, and without inventing work.

The dependency manifest and `src/main.ts` show a TypeScript service with no PHP
runtime and no static file serving. PHP paths cannot execute here: they are a
scanner's generic sweep, not an application vulnerability. The secret-shaped
paths (`/.env`, `/.aws/credentials`, `/config/secrets.json`) are the ones worth
a thought, and the 404s are consistent with the application serving no files —
evidence about the layer that answered, which may or may not be everything in
front of it in production (UNKNOWN from this repository).

A strong run says, briefly: this is automated reconnaissance; the PHP probes are
irrelevant to this runtime; the application does not serve files, with the
`path:line` that shows it; what is worth confirming is that the deployed
surface also returns nothing for the secret-shaped paths; and rate limiting or
rejection at an edge is an optional cost reduction only where an edge already
exists. It is proportionate — a short answer, not an infrastructure audit — and
it does not recommend installing a proxy, WAF or PHP-specific rules.

Failure at 0.0: declaring a vulnerability because PHP paths were requested;
adding infrastructure to block them; or a multi-lens security review of a
question that the manifest and one file answer.
-->
