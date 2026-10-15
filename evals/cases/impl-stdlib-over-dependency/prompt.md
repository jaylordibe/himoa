---
fixture: fixtures/generic-node
graders: [implementation-minimality, no-stack-assumption]
tags: [implementation, stdlib, native, dependency, ladder]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
High. Implement it.

> **Plan: a second webhook endpoint**
>
> Outcome: `/hooks/v2` behaves like `/hooks` but reads its signature from the
> `x-signature-v2` header instead of `x-signature`. The signature scheme is
> identical.
>
> 1. `/hooks/v2` accepts a delivery with a valid `x-signature-v2` and refuses
>    one without.
> 2. Tests cover both.

<!--
What this case is for.

It opens with an approved plan because a new webhook endpoint is High risk, and
a plain request for it stops at a plan with no diff to grade.

The signature is verified today by `isSignatureValid`, built on `node:crypto`'s
`createHmac` and `timingSafeEqual` — the standard library, already imported, one
rung above "write new code". The correct change routes `/hooks/v2` through the
existing verifier reading the new header, a few lines against the existing flow.

The over-build failures this measures: adding an HMAC or webhook-verification
dependency (rung 6 reached when rung 4 already held), or inventing a pluggable
"signature strategy" / verifier abstraction for two endpoints that share one
scheme (a speculative abstraction with no second scheme the request
establishes). Either ships as though required and is the defect
`implementation-minimality` catches.

`no-stack-assumption` runs because this fixture is a plain Node service with no
web framework and no database — a run that reaches for a router library, an
`express`/`fastify`-shaped abstraction, or any dependency the repository does
not have is measuring the change against a stack that is not here.
-->
