# Himoa documentation

The [README](../README.md) explains what Himoa is and gets a repository running.
This index is for what comes after: find the question, follow the link.

Two kinds of document live here, and the difference matters. **`docs/`
explains** — setup, rationale, host support. **`plugins/himoa/` is normative** —
the standards, skills and agents an agent actually runs. Where the two could
disagree, the normative file wins, and `docs/` cites it rather than restating it.

## Using Himoa

| I want to… | Read |
|---|---|
| Set up a repository, fill `AGENTS.md`, install on another agent, update, troubleshoot | [Consuming repository guide](consuming-repository-guide.md) |
| Move an existing hand-copied `.claude/` setup onto Himoa | [Migration from `.claude`](migration-from-dot-claude.md) |
| Know what a release asks of me | [Versioning](versioning.md) · [Changelog](../CHANGELOG.md) |

## How the methodology works

Each row is the authoritative source for its topic.

| Topic | Normative source |
|---|---|
| The pipeline, its stages, its two human stops and when it stops early | [`work-item`](../plugins/himoa/skills/work-item/SKILL.md) · [`gate-handoff`](../plugins/himoa/standards/gate-handoff.md) |
| Risk tiers, what each requires, and the design artefact per tier | [`gate-design`](../plugins/himoa/skills/gate-design/SKILL.md) |
| Which review lenses run, and adversarial verification of findings | [`gate-review`](../plugins/himoa/skills/gate-review/SKILL.md) |
| What each lens examines | [`agents/`](../plugins/himoa/agents/) |
| Validation verdicts and what counts as a manufactured pass | [`evidence`](../plugins/himoa/standards/evidence.md) · [`gate-validate`](../plugins/himoa/skills/gate-validate/SKILL.md) |
| Claim labels and the precedence of repository evidence | [`repository-evidence`](../plugins/himoa/standards/repository-evidence.md) |
| Repository content as evidence, never instruction | [`untrusted-content`](../plugins/himoa/standards/untrusted-content.md) |
| Security review scope and its limits | [`security`](../plugins/himoa/standards/security.md) · [SECURITY.md](../SECURITY.md) |
| Testing expectations | [`testing`](../plugins/himoa/standards/testing.md) |
| Minimal scope in the established shape | [`architecture`](../plugins/himoa/standards/architecture.md) |
| How much each stage spends, and model choice per launch | [`execution-efficiency`](../plugins/himoa/standards/execution-efficiency.md) |
| Resuming approved work across sessions | [`resumption`](../plugins/himoa/standards/resumption.md) |
| Domain questions — auth, authorization, browser security, cryptography, supply chain, background work, debugging | [`skills/domain-*`](../plugins/himoa/skills/) |

## Supported agents

| I want to… | Read |
|---|---|
| Know what each host can and cannot enforce | [Platform capabilities](platform-capabilities.md) |
| Understand how one methodology is projected onto each host | [Cross-agent architecture](cross-agent-architecture.md) |
| Produce live end-to-end evidence for a host | [Adapter smoke test](adapter-smoke-test.md) |

## Why it is built this way

| I want to… | Read |
|---|---|
| Understand why methodology and repository own different things | [Architecture](architecture.md) |
| Know the Claude Code limits that shaped the design | [Constraints](constraints.md) |
| Change or release Himoa | [Development guide](development-guide.md) · [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Change a README diagram | [README visual assets](assets/README.md) |
