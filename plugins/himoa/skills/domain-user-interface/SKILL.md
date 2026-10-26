---
name: domain-user-interface
description: The decisions and failure modes that govern what a person sees, operates or receives — a web interface, a native or cross-platform app screen, a server-rendered page or an email. Carries the questions a change must answer, and none of the answers.
when_to_use: Use when a change alters what a person sees, operates or receives — a page, screen, component, form, navigation, layout, styling or motion, a server-rendered view or an email template — and the tests and verification for any of those.
user-invocable: false
---

# User-facing surfaces

This skill carries the **decisions and the failure modes**. It does not know
how this repository renders anything, and it names no framework.

**After any compaction, re-read this file** —
`${CLAUDE_PLUGIN_ROOT}/skills/domain-user-interface/SKILL.md` — before the next step. A host
may re-attach an invoked skill cut to its opening, and Claude Code does, so
the questions a surface must answer sit below the cut until this file is read
again.

**Establish the mechanism from evidence first** —
`${CLAUDE_PLUGIN_ROOT}/standards/repository-evidence.md` — then apply the
questions below to what you actually found. The repository's own design system,
components, branding and conventions are authoritative: this playbook guides a
change inside them and never licenses a redesign of them.

A specialised design skill this session happens to have may help with
refinement. Nothing here requires one, and nothing one suggests overrides the
repository's own system or the floor below.

## 0. Which surface — decided by what changed

The surface is decided by the **changed file or component**, not by the
repository's headline stack. An email template inside a backend repository is
an email surface; the service that sends it is not. A component in an
application with server routes is a user-facing surface; the route handler is
server code under the ordinary standards. In a workspace of several packages,
each package is its own context with its own commands.

A change that reaches no surface — a service, a job, a query, a migration — has
none, and saying so in a line is the correct answer. Nothing below applies to
it. Where it is genuinely unclear what renders a file, trace what consumes it;
do not decide from a file extension or a directory name, and do not invent
certainty — it is `UNKNOWN` until traced.

## 1. How much of this a change owes

Effort follows `${CLAUDE_PLUGIN_ROOT}/standards/execution-efficiency.md` §3 and
§4; this section only says how a surface maps onto them.

- **A wording fix or a small style or token change** is a Direct-band edit
  when every entry condition of §3 holds — including that no changed path is a
  declared high-risk path: make it. The floor is held by inspection, not by
  ceremony — the text is still legible against its background, focus is still
  visible, and nothing beside it changed in the diff.
- **A screen, form, component behaviour or navigation change** is behaviour,
  planned and tested like any other.
- **A shared token, global style or shared component** has every screen that
  uses it as a consumer, so its blast radius is those screens — the §4 widening
  trigger, not a one-line edit.
- **A surface that reaches authentication, payment, personal data or any other
  sensitive area keeps the tier of what it reaches.** "It is only UI" lowers
  nothing, and hiding or disabling a control is never the control —
  `${CLAUDE_PLUGIN_ROOT}/standards/security.md` §8.

## 2. Establish before deciding

| Question | Answer with `path:line`, or `UNKNOWN` |
|---|---|
| What renders this surface, and for which declared targets — browsers, platform versions, device sizes, email clients? | |
| Which design tokens, components and layout primitives already exist, and which does this change reuse? | |
| How does this codebase already handle loading, empty, error and success, and where does it fetch data and keep state? | |
| What does the repository declare about accessibility and localisation? | |
| What verifies this surface today — component, end-to-end, accessibility or visual checks — and what can this session use to render it? | |
| For an app: native or cross-platform, which platforms, and how are navigation, lifecycle and connectivity handled now? | |
| For an email: how is it built and sent, and does it carry a plain-text part? | |

An **`UNKNOWN`** you could have resolved by reading is a gap to close, not a
licence to pick a default. An **`ABSENT`** design system or accessibility
statement is a finding: the change follows the nearest existing surface, and
any choice it makes beyond that is labelled `ASSUMPTION` for the human.

## 3. The decisions this change must make

1. **Every state the data can be in** — loading, empty, error, partial, success,
   and offline where the surface is used offline — and what the person can do
   in each. Input they typed survives an error.
2. **What each element is.** A control that acts is a button, one that navigates
   is a link, a list is a list; every control has an accessible name, every
   input a label, every error is associated with its field and announced.
3. **How it is operated.** The keyboard or assistive-input path reaches every
   action in a sensible order; focus moves to what opened and returns when it
   closes; nothing is reachable only by hover or by a precise gesture.
4. **How it holds up.** At the narrowest and widest declared sizes, and under
   worst-case content: very long and very short text, unbroken strings,
   translated text, zero items, very many items, missing optional fields, large
   numbers. Zoom and text scaling stay enabled.
5. **How it stays consistent.** Existing tokens and components before new
   values; hierarchy from size, weight, spacing and position; contrast
   sufficient for text and controls in every theme the repository supports.
   **Restraint: no decoration the requirement did not ask for.**
6. **Whether it moves at all.** Motion needs a purpose — feedback, continuity,
   a change of state. A frequent or keyboard-driven action usually should not
   animate. A reduced-motion preference means fewer and gentler movements, not
   none, and keeps the feedback that carries meaning. Motion is interruptible
   and avoids properties that force layout on every frame.
7. **Where data and state live** — in the pattern this repository already uses.
   One screen is not a reason for a new library, store or abstraction
   (`${CLAUDE_PLUGIN_ROOT}/standards/architecture.md` §3).
8. **What it costs the client** — work per interaction, list size, image
   weight, and what the change adds to what is downloaded.
9. **How each of the above is tested and verified** — §6.

## 4. Platform specifics — apply only what is present

### Web

- Detect capability — hover, pointer precision, viewport — with the platform's
  feature and media queries, never by sniffing the user agent. Touch and pointer
  are not exclusive; hover may enhance and never gate.
- On phones, viewport height changes with browser chrome and the on-screen
  keyboard, and full-bleed layouts meet the device's safe-area insets.
- Where the repository renders on the server, the core action keeps working
  before client code loads, if the existing design relies on that.

### Native and cross-platform apps

- Each target platform's own navigation conventions — back behaviour, gestures,
  system sheets — where the repository targets it. Web habits do not transfer:
  hover, right-click and tooltip-only affordances do not exist here. Nor is one
  platform's pattern forced on another unless the repository's design does so.
- Safe areas and system UI; touch targets at the size the platform's guidance
  sets; the on-screen keyboard never covers the focused input.
- Lifecycle: what survives backgrounding, termination and restoration.
  Connectivity: what the person sees on a slow or lost network, and how they
  retry. Offline behaviour only where the requirement calls for it.
- Long lists use the platform's recycling mechanism; no timers or per-frame
  work while backgrounded; images sized for the screen they land on.
- Assistive technology through the platform's own labels, roles and text
  scaling. Deep links, device storage and permissions are a trust boundary —
  `${CLAUDE_PLUGIN_ROOT}/standards/security.md` §8.

### Server-rendered views

Output is encoded for its context — `${CLAUDE_PLUGIN_ROOT}/standards/security.md`
§4 and §8 — and personalised output is never cached as if it were shared.

### Email

**Email-client compatibility outranks browser styling.** Use the layout and
styling technique the repository's existing templates already use, which is
usually far more conservative than the web. No script; no dependence on
external stylesheets or web fonts; images may be blocked, so meaning survives
without them; dark-mode clients may invert colours. Send a plain-text part where
the repository sends one. Links are absolute and point at routes that will keep
working — a sent email cannot be updated
(`${CLAUDE_PLUGIN_ROOT}/standards/architecture.md` §4) — and are built from a
configured base address, never from the incoming request's host. Interpolated
data is encoded, and header fields carry no line breaks from user input: an
email is a rendered context like any page
(`${CLAUDE_PLUGIN_ROOT}/standards/security.md` §4).

## 5. The failure modes, in order of how often they are real

### The happy path only

The screen works with data and fails silently without it — no loading state, an
empty list that reads as broken, an error that loses what the person typed.

### A control that is not one

A clickable container instead of a button, a link that does not navigate, an
icon with no name. It looks right and is unusable by keyboard or assistive
technology.

### Lost focus

A dialog opens and focus stays behind it; a route changes and focus is nowhere.

### Layout that breaks on real content

Designed against tidy sample data, then given a long name, a translation or a
thousand rows.

### A parallel system

A hard-coded value beside an existing token, a new component duplicating one the
repository has, a library added for one screen. Each is a second thing to keep
consistent, and the first sign of a design system eroding.

### A visual change nobody asked for

Restyling neighbouring elements, adding gradients, shadows, cards or decorative
motion, or reshaping a layout the requirement did not mention — the generic
default look. Taste comes from the repository and the human, not from this
playbook. On a new surface with no existing system, choose restrained defaults
and label them `ASSUMPTION` for review.

### The wrong platform's habits

Web patterns on a native screen, native patterns on the web, browser-only
styling in an email.

### A claim of having seen it

Reading the code that renders a surface is static review. It is not a visual,
browser, device or accessibility check, and reporting it as one is a false
pass.

## 6. Tests and evidence

Write each test this repository's own layers can express, at the cheapest one
that proves it (`${CLAUDE_PLUGIN_ROOT}/standards/testing.md` §2):

- each state the change makes reachable renders what the requirement says;
- each new control can be reached and operated by keyboard or assistive input,
  and has its accessible name;
- a validation error appears beside, and is associated with, its field.

Updating a visual or snapshot baseline to make a check pass is manufacturing a
pass unless the visual change was the requirement —
`${CLAUDE_PLUGIN_ROOT}/standards/evidence.md` §5.

**Claim only what was rendered.** Rendering a surface with a tool the session
has is worth doing when it materially changes confidence, and is never required
for every change. Its scope is the change's own: the states, sizes and targets
the change makes reachable, and any the approved verification names — one
rendering proves only its own state, size and renderer, never the rest. Render
again only for a concrete failure or a material
question still open, and stop when the questions are answered
(`${CLAUDE_PLUGIN_ROOT}/standards/execution-efficiency.md` §8.1) — never an
open-ended loop of looking and adjusting. At validation it only inspects
(`gate-validate` §8). Report which renderer, size and state each rendering
covered; where something was not rendered, say so. `${CLAUDE_PLUGIN_ROOT}/standards/evidence.md` §3 says what
each kind of rendering proves and what it does not.
