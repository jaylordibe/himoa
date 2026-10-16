#!/usr/bin/env node
//
// Builds a suite `claude plugin eval` can run, from this corpus.
//
// WHY THIS EXISTS
// ---------------
// The corpus here is written once — `cases/*/prompt.md` naming a fixture and
// shared rubrics in `graders/` — and that layout is not the one the runner
// loads. The runner wants an eval directory *inside* the plugin, a rubric per
// case under `<case>/graders/`, only its own frontmatter keys, and a run that
// starts in an empty directory with files arriving through a scaffold script.
//
// Moving the corpus into the plugin would ship it, fixtures and all, to every
// consumer's plugin cache. Keeping a second, runner-shaped copy by hand would
// drift from this one silently. So the runner's copy is derived: this script
// copies the plugin to an output directory outside the repository and writes
// the suite into that copy. Nothing it writes is committed or shipped.
//
// Usage:
//   node evals/build-plugin-eval-suite.mjs [--out <dir>] [--case <name>...] [--include-hosted]
// then run the command it prints. `--scaffold` is required at run time
// because the fixture arrives through the scaffold script, and the gate
// cases need `--allow-tools` for the tools a gate uses.
//
// No dependencies.

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const casesRoot = join(repositoryRoot, 'evals', 'cases');
const gradersRoot = join(repositoryRoot, 'evals', 'graders');
const pluginSource = join(repositoryRoot, 'plugins', 'himoa');

const argv = process.argv.slice(2);
const option = (name) => {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};
const selectedCases = argv.flatMap((value, index) => (argv[index - 1] === '--case' ? [value] : []));
const outputRoot = resolve(option('--out') ?? mkdtempSync(join(tmpdir(), 'himoa-plugin-eval-')));

// The runner's case budget. Gate cases launch a panel; a ceiling that stops a
// run mid-review grades the ceiling, not the framework.
const MAX_TURNS = 120;
const TIMEOUT_SECONDS = 2400;
const ALLOWED_TOOLS = ['Read', 'Glob', 'Grep', 'Bash', 'Edit', 'Write', 'Skill', 'Agent'];

function parseCase(promptPath) {
  const text = readFileSync(promptPath, 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) throw new Error(`${promptPath}: no frontmatter`);
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator > 0) frontmatter[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  const list = (value) => (value ?? '').replace(/^\[|\]$/g, '').split(',').map((item) => item.trim()).filter(Boolean);
  const notes = [...match[2].matchAll(/<!--([\s\S]*?)-->/g)].map((comment) => comment[1].trim()).join('\n\n');
  // The grading notes never reach the agent under test; they reach the judge.
  const prompt = match[2].replace(/<!--[\s\S]*?-->/g, '').trim();
  return { fixture: frontmatter.fixture, graders: list(frontmatter.graders), tags: list(frontmatter.tags), prompt, notes };
}

const pluginCopy = join(outputRoot, 'himoa');
rmSync(pluginCopy, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
cpSync(pluginSource, pluginCopy, { recursive: true });
const suiteRoot = join(pluginCopy, 'evals');
mkdirSync(suiteRoot, { recursive: true });

// Cases tagged `needs-stub` need the stub host on the agent session's path, which
// the runner's scaffold cannot arrange — a run without it ends BLOCKED for want
// of an integration and scores as a correct stop while exercising nothing. So
// they are left out unless asked for by name or with --include-hosted, and then
// the operator owns the environment evals/README.md describes.
const includeHosted = argv.includes('--include-hosted');
const caseNames = readdirSync(casesRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => selectedCases.length === 0 || selectedCases.includes(name))
  .filter((name) => {
    if (includeHosted || selectedCases.includes(name)) return true;
    const needsStub = parseCase(join(casesRoot, name, 'prompt.md')).tags.includes('needs-stub');
    if (needsStub) console.log(`skipped ${name}: tagged needs-stub (evals/README.md); pass --include-hosted`);
    return !needsStub;
  })
  .sort();

// A hosted case run with the operator's own signed-in host tools or connected
// servers could reach a real repository, whatever host the case names.
if (caseNames.some((name) => /^hosted-review-|^local-review-with-remote|^work-item-pr-url/.test(name))) {
  console.log('hosted cases selected: run with no MCP or connector servers, GH_TOKEN, GITHUB_TOKEN and GITLAB_TOKEN unset, and GH_CONFIG_DIR pointing at an empty directory.');
  if (includeHosted) console.log('--include-hosted: the runner cannot export HIMOA_EVAL_DIR for a scaffold it creates, so these runs are VOID unless the operator supplies it (the stub says so in the transcript).');
}

for (const caseName of caseNames) {
  const parsed = parseCase(join(casesRoot, caseName, 'prompt.md'));
  const caseRoot = join(suiteRoot, caseName);
  mkdirSync(join(caseRoot, 'graders'), { recursive: true });

  writeFileSync(join(caseRoot, 'prompt.md'), [
    '---',
    `tags: [${parsed.tags.join(', ')}]`,
    'runs: 1',
    `max_turns: ${MAX_TURNS}`,
    `timeout_seconds: ${TIMEOUT_SECONDS}`,
    `allowed_tools: [${ALLOWED_TOOLS.join(', ')}]`,
    '---',
    '',
    parsed.prompt,
    '',
  ].join('\n'));

  // The fixture is copied by absolute path because the runner passes the
  // scaffold no plugin or eval-directory location. It is committed so a gate
  // that reads the worktree diff sees the fixture as the base, as a developer
  // opening a session in it would.
  const fixtureRoot = join(repositoryRoot, parsed.fixture);
  if (!existsSync(fixtureRoot)) throw new Error(`${caseName}: fixture ${parsed.fixture} does not exist`);
  // A case whose situation is the state of the worktree — a developer's
  // uncommitted work, a change not yet committed — carries a `setup.sh` that
  // makes it on top of the committed fixture. One fixture serves many
  // situations this way, instead of a fixture copy per dirty state.
  const setupScript = join(casesRoot, caseName, 'setup.sh');
  writeFileSync(join(caseRoot, 'scaffold.sh'), [
    '#!/bin/bash',
    'set -euo pipefail',
    `cp -R ${JSON.stringify(fixtureRoot + '/.')} .`,
    'git init -q && git add -A',
    'git -c user.name=eval -c user.email=eval@example.invalid commit -qm fixture',
    ...(existsSync(setupScript) ? [`bash ${JSON.stringify(setupScript)}`] : []),
    '',
  ].join('\n'), { mode: 0o755 });
  writeFileSync(join(caseRoot, 'case.yaml'), [
    'schema_version: "1.1"',
    `name: ${caseName}`,
    'context:',
    '  scaffold_script: scaffold.sh',
    '',
  ].join('\n'));

  for (const grader of parsed.graders) {
    const rubric = readFileSync(join(gradersRoot, `${grader}.md`), 'utf8');
    writeFileSync(join(caseRoot, 'graders', `${grader}.md`), [
      '---',
      'type: llm',
      'focus: trace',
      '---',
      '',
      rubric.trim(),
      '',
      '## This case',
      '',
      'What the case expects, written by its author. Score the run against the rubric above, using this to decide what the rubric means here. A run passes when it would score at least the second-highest row of the rubric\'s scoring table.',
      '',
      parsed.notes || '(The case carries no notes.)',
      '',
    ].join('\n'));
  }
}

console.log(`plugin eval suite — ${caseNames.length} case(s) written to ${suiteRoot}\n`);
console.log('Run (each case is a full agent session, plus a no-plugin baseline arm):');
console.log(`  cd ${JSON.stringify(outputRoot)} && claude plugin eval ./himoa --scaffold --trust-plugin --allow-tools Bash Edit Write`);
