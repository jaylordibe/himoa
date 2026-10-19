# Platform capability contract

Himoa is one methodology with **thin, native adapters** per coding agent. The
methodology owns *what must be true*; an adapter owns *how this host makes it
true*. Those are different, and conflating them is how a framework quietly
becomes "prompts that also run elsewhere."

This file records, per platform, whether each framework requirement can be met
and **how strongly it is enforced**. Its job is to prevent false equivalence: a
requirement that a host can only *advise* is never reported as *enforced*.

> **Adapt the framework to the agent. Never weaken the framework to fit the
> agent.** When portability and framework integrity conflict, integrity wins.

## Enforcement vocabulary

| Level | Means |
|---|---|
| **native** | The host provides a first-class mechanism for it |
| **hard** | The host can *block* the violation at runtime, not merely discourage it |
| **advisory** | Carried as instruction the model is expected to follow; not runtime-blocked |
| **methodology** | Guaranteed by how the framework is written (a gate the model cannot self-start, a verdict it cannot round up) rather than by a host feature |
| **unsupported** | No mechanism, in any spelling |

`native` and `hard` are not the same axis: a mechanism can be native and still
only advisory (an always-read instruction file), and a guarantee can be
methodology-enforced on every host without any native feature at all.

## Compatibility levels

| Level | Meaning |
|---|---|
| **Reference / Full** | Every required guarantee is expressible with the host's native mechanisms, and the implementation is production-proven here |
| **Supported (initial adapter)** | Every required primitive maps to a native mechanism and the adapter is shipped and structurally validated; a live end-to-end run inside the host is the remaining evidence |
| **Supported with limitations** | The adapter ships and delivers the methodology, but one or more primitives cannot be enforced on the host and are recorded as advisory or unsupported rather than implied |
| **Researched** | Instruction substrate and some primitives confirmed; no adapter shipped |
| **Preliminary** | Partial or unverified substrate; relying on it would be a guess |

"Compatible in theory" is **not** "supported." A platform is only advertised as
supported once its adapter actually runs the methodology. The live run that lifts
an adapter from "Supported (initial)" toward parity is defined, ready and honest
about being host-gated: `docs/adapter-smoke-test.md`. It is not run in CI (no host
runtime there) and its result is never fabricated.

## The requirement × platform contract

Verified 2026-09-20 against each host's official documentation. Platform
behaviour is version-sensitive; re-verify before relying on a row
(`standards/repository-evidence.md` §2b).

| Requirement | Claude Code | OpenAI Codex |
|---|---|---|
| **Always-on methodology bootstrap** | SessionStart hook injects the charter; **version-stamped** from `plugin.json`; native | `AGENTS.md` (root→CWD cascade, 32 KiB cap), always read; **stamped once, never refreshed**; native-load, content advisory |
| **Progressive-disclosure skills** | `SKILL.md` + description-driven load; native | `SKILL.md` + `name`/`description`, ≤2% preview, `.agents/skills/`; native |
| **Independent read-only reviewers** | subagents with no file-editing tool (`disallowedTools`), fresh context; Bash remains, so read-only is methodology | subagents `.codex/agents/*.toml`, `sandbox_mode="read-only"`, isolated context; native |
| **Human-approval gate the model cannot self-start** | `disable-model-invocation` gate skills; native + methodology | `policy.allow_implicit_invocation:false`; native + methodology. Plus `approval_policy=on-request` is **hard** for restricted ops |
| **Human-owned operations** (commit/deploy/migrate) | methodology (charter) | methodology; `sandbox_mode`/`approval_policy` can additionally **hard-block** |
| **MCP** | native | native (`[mcp_servers.*]`) |
| **Evidence semantics · quality-bar · risk tiers · execution-efficiency · repository-evidence** | methodology | methodology |
| **Hosted review execution isolation** (`standards/hosted-review.md` §5–§6) | the Bash sandbox — verified 2026-10-16 below; **off by default**, so the default outcome is `instruction-only` and validation `BLOCKED` | UNKNOWN — `sandbox_mode` exists, but whether it isolates a clone's code from credentials and network has not been verified |

### What each row implies for an adapter

- **The bootstrap has one honest gap on Codex: its version stamp goes stale.**
  Claude Code's charter carries the plugin version and auto-updates. A Codex
  `AGENTS.md` records the version its bootstrap was written with, but
  re-running the installer leaves an existing bootstrap untouched and no doctor
  compares that stamp, so it does not update. An adapter must surface that a
  Codex repository can silently run an old methodology, rather than imply
  parity.
- **Both hosts can *hard-gate* a tool call, and Himoa declines to on both.** The
  "methodology, not enforcement" line is platform-independent — it is a design
  choice, not a Claude limitation. An adapter never turns a stated boundary into
  a runtime block just because the host would allow it.
- **Human approval is `native + methodology`, not `hard`.** Neither host makes
  it *impossible* for a misbehaving model to proceed; both prevent the model
  from *invoking the approval gate itself*, and the methodology forbids
  inferring approval. Reporting this as "hard" would be the false equivalence
  this file exists to stop.

### Hosted review on Claude Code — verified 2026-10-16

Against the sandboxing, sub-agents, permissions, memory and MCP pages of the
Claude Code documentation:

- **There is an OS-enforced sandbox for Bash**, off by default, turned on with
  `/sandbox` or `sandbox.enabled`. It limits writes — to the working directory,
  a per-user temporary directory and any added directories, so **the developer's
  project stays writable**, which is why the hosted probe tests a write under
  the project root — and routes network through a
  proxy whose allowed-domain list starts empty. **It does not limit reads by
  default** — most of the machine stays readable unless `denyRead` says
  otherwise — and it does not cover the Read tool, MCP servers or hooks. Where
  its dependencies are missing it runs commands unsandboxed unless
  `sandbox.failIfUnavailable` is set.
- **No documented signal tells a session the sandbox is active.** That is why
  the hosted standard establishes execution isolation by a probe from inside the
  environment, never from configuration — and why, with no probe passing, a
  check is `BLOCKED`.
- **A subagent's Bash calls are sandboxed** — not stated in the documentation,
  but measured on 2.1.301 (2026-10-16): with the sandbox on, a write to the home
  directory was denied for the main session and for a general-purpose subagent
  alike. The default writable set still includes the working directory and the
  temporary directories, so the hosted probe, which requires writes outside the
  check's own directory to fail, does not pass under default settings: a named
  check stays `BLOCKED` until the human also denies those writes.
- **A project's `CLAUDE.md` and `.mcp.json` load from the session's own project
  root.** Subdirectory `CLAUDE.md` files load on demand under the working
  directory. A directory outside it — where the hosted clone lives — loaded
  nothing in a measured run on 2.1.301 (2026-10-16): reading a file there and
  changing into it loaded neither its `CLAUDE.md`, its `.claude/settings.json`
  hooks nor its `.mcp.json`. The documentation does not promise this, so the
  clone is still kept outside the project, and no session is ever
  started inside it.

Himoa enables none of this. It is the human's setting to turn on, and the
framework's line on permissions is unchanged.

### Hosted review on the other hosts

| Host | Hosted review |
|---|---|
| **OpenAI Codex** | The standard and the gate are projected. Whether `sandbox_mode` keeps a clone's code from credentials and the network, and whether a Codex session can reach a host integration, are UNKNOWN — so the restrictions are `instruction-only` and validation is `BLOCKED` until a live run shows otherwise |
| **Cursor** | Projected, through the same shared skills and standards. Its subagents' isolation and host access are UNKNOWN; same defaults |
| **Gemini CLI** | Projected, as the `/himoa:gate-review` command. Its subagents have no shell, which removes the execution path for lenses; whether the conducting session can clone and reach a host is UNKNOWN |
| **GitHub Copilot** | Not applicable — no skill mechanism, so there is no `gate-review` to run in hosted mode |


## The non-downgrade rule

An adapter **must not silently downgrade**. If a host cannot enforce a required
guarantee at the level the framework needs, the adapter states the limitation —
it never reports "fully supported" for a guarantee that is only advisory on that
host, and it never reinterprets "human approval required" as "the agent may
infer approval."

## Support today

| Platform | Level |
|---|---|
| **Claude Code** | **Reference / Full** — production-proven |
| **OpenAI Codex** | **Supported (initial adapter)** — projection, `$HOME` installer, doctor and repository bootstrap shipped and structurally validated (`docs/cross-agent-architecture.md`). Live end-to-end execution inside Codex has not been smoke-tested here; that evidence is pending, so it is not claimed at parity |
| **Cursor** | **Supported (initial adapter)** — reads `SKILL.md`/`AGENTS.md` natively and honours `disable-model-invocation`; reviewer roles are read-only local subagents; installed via `himoa-cursor-install`. Shares the skills/standards install with Codex. Live end-to-end not yet smoke-tested, so not claimed at parity |
| **GitHub Copilot** | **Supported with limitations** — repo-committed `AGENTS.md` bootstrap delivers the methodology and human approval is **hard** (structural PR review). But reviewer lenses are **advisory** (no spawnable read-only subagent), there is no `SKILL.md` mechanism, and `context-mapper` is not projected (over the 30 000-char custom-agent limit). Installed via `himoa-copilot-install` (repo only, never `$HOME`) |
| **Gemini CLI** | **Supported (initial adapter)** — reuses `AGENTS.md` via the `context.fileName` setting (no `GEMINI.md` fork); reviewer roles are **native read-only subagents** (tools allowlist, isolated context); the workflow projects to native `/himoa:*` slash commands; gates stay human-typed. Installed via `himoa-gemini-install`. Live run host-gated |

### Verified corrections (2026-09-20)

Re-verification against current Codex docs changed these details, now reflected
in the adapter: the approval slash command is **`/permissions`** (was
`/approvals`); the `"untrusted"` approval policy is **retired** (use
`on-request`/`never`); `--full-auto` is **deprecated**; hooks are a **production
feature**, not beta. Codex also now has a **plugin marketplace** (`/plugins`),
but its CLI and cache specifics are documented only in secondary sources, so the
adapter targets the **documented loose-file paths** rather than the marketplace
(`standards/repository-evidence.md` §2b — an unverified external mechanism is
not built against).
