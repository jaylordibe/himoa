#!/usr/bin/env node
//
// Exercises the Codex and Cursor installers and repository bootstrap against an
// ISOLATED fake HOME and fake repositories — never the real environment.
//
// The installers write into $HOME (skills at ~/.agents/skills, the reference
// home at ~/.agents/himoa, reviewer agents at ~/.codex/agents or ~/.cursor/
// agents). Their safety is asserted, not trusted: only Himoa-owned paths,
// idempotent, no dangling references, uninstall removes only what it owns and
// keeps shared files a co-installed host still needs, and a user-authored
// AGENTS.md is never destroyed. HOME/CODEX_HOME are overridden per run.
//
// Also asserts the structural guarantees the projection must carry onto each
// host: human-only skills cannot be model-invoked, and reviewer agents run
// read-only.
//
// No dependencies. Run: node tests/validate-adapter-install.mjs

import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync, symlinkSync, lstatSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = join(repoRoot, 'plugins', 'himoa');
const adapters = join(pluginRoot, 'adapters');
const bin = (host) => join(pluginRoot, 'bin', `himoa-${host}-install`);

let failures = 0;
const check = (name, cond, detail) => {
  if (cond) { console.log(`PASS  ${name}`); return; }
  failures += 1;
  console.error(`FAIL  ${name}${detail ? `\n      ${detail}` : ''}`);
};

const run = (host, args, { home, codexHome, cwd }) => spawnSync(bin(host), args, {
  cwd: cwd || repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: codexHome }, encoding: 'utf8',
});
function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const snapshot = (dir) => new Map(walk(dir).map((p) => [p, readFileSync(p, 'utf8')]));
const tmpRoots = [];
const freshHome = (prefix = 'himoa-home-') => { const d = mkdtempSync(join(tmpdir(), prefix)); tmpRoots.push(d); return d; };
// A home path carrying every character the installer's sed replacement treats
// specially. An `&` once wrote the token back into every reference, exit 0.
const AWKWARD_HOME = 'himoa home & | \\ -';
const agentsDir = (host, home, codexHome) => host === 'codex' ? join(codexHome, 'agents') : join(home, '.cursor/agents');

const expectedSkills = readdirSync(join(adapters, 'skills')).filter((n) => n.startsWith('himoa-')).length;
const expectedAgents = readdirSync(join(adapters, 'codex/agents')).filter((n) => n.endsWith('.toml')).length;

function installAndAssert(host, homePrefix) {
  const home = freshHome(homePrefix);
  const tag = homePrefix ? `${host} (awkward home)` : host;
  const codexHome = join(home, '.codex');
  const r = run(host, [], { home, codexHome });
  check(`${tag}: install exits 0`, r.status === 0, r.stderr);

  const skillsRoot = join(home, '.agents/skills');
  const skills = existsSync(skillsRoot) ? readdirSync(skillsRoot).filter((n) => n.startsWith('himoa-')) : [];
  const agents = existsSync(agentsDir(host, home, codexHome)) ? readdirSync(agentsDir(host, home, codexHome)).filter((n) => n.startsWith('himoa-')) : [];
  check(`${tag}: all skills installed (shared)`, skills.length === expectedSkills, `${skills.length}/${expectedSkills}`);
  check(`${tag}: all reviewer agents installed`, agents.length === expectedAgents, `${agents.length}/${expectedAgents}`);
  check(`${tag}: reference home present`, existsSync(join(home, '.agents/himoa/standards')) && existsSync(join(home, '.agents/himoa/VERSION')));

  const installed = snapshot(home);
  check(`${tag}: @HIMOA_HOME@ fully resolved`, ![...installed.values()].some((c) => c.includes('@HIMOA_HOME@')));
  // existsSync first: a failed install must fail this check, not end the run
  // before the cases after it can report.
  const installedVersion = join(home, '.agents/himoa/VERSION');
  check(`${tag}: installed version matches canonical`, existsSync(installedVersion)
    && readFileSync(installedVersion, 'utf8').trim() === readFileSync(join(adapters, 'VERSION'), 'utf8').trim());

  // End-to-end coherence: every referenced standards/template path and every
  // himoa-<skill> invocation resolves to an installed file.
  const himoaHome = join(home, '.agents/himoa');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const refRe = new RegExp(`${esc(himoaHome)}/(standards|templates)/([A-Za-z0-9._-]+\\.md)`, 'g');
  const dangling = [];
  let resolved = 0;
  for (const [file, content] of installed) {
    for (const m of content.matchAll(refRe)) {
      if (existsSync(join(himoaHome, m[1], m[2]))) resolved += 1; else dangling.push(`${file} -> ${m[1]}/${m[2]}`);
    }
  }
  check(`${tag}: no dangling references in installed methodology`, dangling.length === 0, dangling.slice(0, 6).join('; '));
  // Without a count the check above passes vacuously when a corrupted prefix
  // makes no reference match the expected home at all.
  check(`${tag}: installed references name the real home and resolve`, resolved > 0, `${resolved} resolved`);

  const unexpected = readdirSync(home).filter((n) => n !== '.agents' && n !== '.codex' && n !== '.cursor');
  check(`${tag}: writes nothing outside .agents/.codex/.cursor`, unexpected.length === 0, unexpected.join(', '));

  const before = snapshot(home);
  run(host, [], { home, codexHome });
  const after = snapshot(home);
  check(`${tag}: second install is byte-identical (idempotent)`, before.size === after.size && [...before].every(([p, c]) => after.get(p) === c));

  const home2 = freshHome();
  const rc = run(host, ['--check'], { home: home2, codexHome: join(home2, '.codex') });
  check(`${tag}: --check writes nothing`, rc.status === 0 && walk(home2).length === 0);
}

installAndAssert('codex');
installAndAssert('cursor');
installAndAssert('codex', AWKWARD_HOME);

// --- Symlinked destinations are refused before anything is written --------
// An existing himoa-reviewer.toml linked to an unrelated file was overwritten
// with a reviewer agent while the install exited 0. Each case plants a link at
// a destination the run would write (or a Himoa-owned directory above one),
// and asserts the unrelated file survives byte for byte, the link survives,
// and nothing was installed.
{
  const regularFiles = (dir) => {
    if (!existsSync(dir)) return [];
    const out = [];
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isSymbolicLink()) continue;
      if (e.isDirectory()) out.push(...regularFiles(p)); else out.push(p);
    }
    return out;
  };
  const outside = () => { const d = mkdtempSync(join(tmpdir(), 'himoa-outside-')); tmpRoots.push(d); return d; };
  const plant = (linkPath, target) => { mkdirSync(dirname(linkPath), { recursive: true }); symlinkSync(target, linkPath); };
  const binFor = (host) => join(pluginRoot, 'bin', `himoa-${host}-install`);

  const cases = [
    { host: 'codex', what: 'linked agent file', at: (h) => join(h, '.codex/agents/himoa-reviewer.toml') },
    { host: 'cursor', what: 'linked Himoa home directory', at: (h) => join(h, '.agents/himoa'), dir: true },
    { host: 'codex', what: 'linked directory inside a skill', at: (h) => join(h, '.agents/skills/himoa-work-item/agents'), dir: true },
    { host: 'gemini', what: 'linked agent file', at: (h) => join(h, '.gemini/agents/himoa-reviewer.md') },
    // Gemini wires its own owned roots; a linked directory below its home must
    // be caught there, not only by VERSION's root.
    { host: 'gemini', what: 'linked standards directory', at: (h) => join(h, '.gemini/himoa/standards'), dir: true },
    { host: 'gemini', what: 'dangling linked VERSION', at: (h) => join(h, '.gemini/himoa/VERSION'), dangling: true },
  ];
  for (const c of cases) {
    const home = freshHome();
    const victimDir = outside();
    const victim = join(victimDir, 'unrelated.txt');
    writeFileSync(victim, 'UNRELATED-CONTENT\n');
    const target = c.dangling ? join(victimDir, 'absent') : c.dir ? victimDir : victim;
    plant(c.at(home), target);
    const r = spawnSync(binFor(c.host), [], { cwd: repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: join(home, '.codex'), GEMINI_HOME: join(home, '.gemini') }, encoding: 'utf8' });
    const name = `symlink: ${c.host} ${c.what}`;
    check(`${name} is refused (non-zero exit)`, r.status !== 0, `exit ${r.status}`);
    // The refusal names the link, so a crash on this path cannot pass for one.
    check(`${name}: the refusal names the linked path`, r.stderr.includes(c.at(home)), r.stderr);
    check(`${name}: the unrelated file is unchanged`, readFileSync(victim, 'utf8') === 'UNRELATED-CONTENT\n');
    check(`${name}: nothing was written through the link`, readdirSync(victimDir).length === 1, readdirSync(victimDir).join(', '));
    check(`${name}: the link itself is kept`, lstatSync(c.at(home)).isSymbolicLink());
    check(`${name}: nothing was installed`, regularFiles(home).length === 0, regularFiles(home).slice(0, 3).join(', '));
  }

  // Copilot writes into the repository; same refusal, before AGENTS.md exists.
  {
    const repo = outside();
    const victimDir = outside();
    const victim = join(victimDir, 'unrelated.txt');
    writeFileSync(victim, 'UNRELATED-CONTENT\n');
    plant(join(repo, '.github/agents/himoa-reviewer.agent.md'), victim);
    const r = spawnSync(binFor('copilot'), [], { cwd: repo, env: { ...process.env, HOME: freshHome() }, encoding: 'utf8' });
    check('symlink: copilot linked agent file is refused', r.status !== 0, `exit ${r.status}`);
    check('symlink: copilot refusal names the linked path', r.stderr.includes('.github/agents/himoa-reviewer.agent.md'), r.stderr);
    check('symlink: copilot leaves the unrelated file unchanged', readFileSync(victim, 'utf8') === 'UNRELATED-CONTENT\n');
    check('symlink: copilot writes no AGENTS.md when it refuses', !existsSync(join(repo, 'AGENTS.md')));
  }

  // A directory where a file is expected. The render's `mv` once moved the
  // file inside it and the install exited 0 with the expected file absent.
  // The directory and its contents must survive, with nothing installed and no
  // temporary file left anywhere.
  for (const [host, rel, inRepo] of [
    ['codex', '.codex/agents/himoa-reviewer.toml'],
    ['gemini', '.gemini/agents/himoa-reviewer.md'],
    ['copilot', '.github/agents/himoa-reviewer.agent.md', true],
  ]) {
    const root = inRepo ? outside() : freshHome();
    const home = inRepo ? freshHome() : root;
    const dir = join(root, rel);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'mine.txt'), 'MINE\n');
    const r = spawnSync(binFor(host), [], { cwd: inRepo ? root : repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: join(home, '.codex'), GEMINI_HOME: join(home, '.gemini') }, encoding: 'utf8' });
    const name = `directory collision: ${host} ${rel}`;
    const left = regularFiles(root);
    check(`${name} is refused (non-zero exit)`, r.status !== 0, `exit ${r.status}`);
    check(`${name}: the refusal names the path`, r.stderr.includes(rel), r.stderr);
    check(`${name}: the directory keeps exactly its own contents`, readdirSync(dir).join() === 'mine.txt' && readFileSync(join(dir, 'mine.txt'), 'utf8') === 'MINE\n', readdirSync(dir).join(', '));
    check(`${name}: nothing installed, no temporary file left`, left.length === 1 && !left.some((f) => f.includes('.himoa-tmp.')), left.slice(0, 3).join(', '));
  }

  // A directory where the bootstrap expects AGENTS.md or Gemini's settings
  // file. AGENTS.md as a directory once printed "Prepended" with exit 0 and
  // wrote nothing; Gemini wrote AGENTS.md before failing on the settings one.
  for (const [host, args, rel] of [
    ['codex', ['--repo'], 'AGENTS.md'],
    ['copilot', [], 'AGENTS.md'],
    ['gemini', ['--repo'], '.gemini/settings.json'],
  ]) {
    const repo = outside();
    mkdirSync(join(repo, rel), { recursive: true });
    writeFileSync(join(repo, rel, 'mine.txt'), 'MINE\n');
    const r = spawnSync(binFor(host), args, { cwd: repo, env: { ...process.env, HOME: freshHome() }, encoding: 'utf8' });
    const left = regularFiles(repo);
    check(`directory collision: ${host} refuses a directory at ${rel}`, r.status !== 0 && r.stderr.includes(rel), `exit ${r.status}: ${r.stderr}`);
    check(`directory collision: ${host} leaves the repository exactly as it was`, left.length === 1 && left[0] === join(repo, rel, 'mine.txt'), left.slice(0, 3).join(', '));
  }

  // A repository file the bootstrap would rewrite: the link and its target both
  // survive. Previously a linked AGENTS.md was replaced by a regular file.
  for (const [host, rel] of [['codex', 'AGENTS.md'], ['gemini', '.gemini/settings.json']]) {
    const repo = outside();
    const victimDir = outside();
    // Valid JSON, so a refusal placed after the settings merge would rewrite it
    // and replace the link — a non-JSON target made that pass vacuously.
    const victim = join(victimDir, 'linked-target');
    writeFileSync(victim, '{}\n');
    plant(join(repo, rel), victim);
    const r = spawnSync(binFor(host), ['--repo'], { cwd: repo, env: { ...process.env, HOME: freshHome() }, encoding: 'utf8' });
    check(`symlink: ${host} --repo refuses a linked ${rel}`, r.status !== 0, `exit ${r.status}`);
    check(`symlink: ${host} --repo keeps ${rel} a link`, lstatSync(join(repo, rel)).isSymbolicLink());
    check(`symlink: ${host} --repo leaves the link target unchanged`, readFileSync(victim, 'utf8') === '{}\n');
  }

  // Legitimate: a dotfiles setup that links a directory ABOVE the Himoa-owned
  // paths keeps working, and the install lands in the link's target.
  {
    const home = freshHome();
    const dotfiles = outside();
    symlinkSync(dotfiles, join(home, '.codex'));
    const r = spawnSync(binFor('codex'), [], { cwd: repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: join(home, '.codex') }, encoding: 'utf8' });
    check('symlink: a linked ~/.codex directory still installs', r.status === 0, r.stderr);
    const n = existsSync(join(dotfiles, 'agents')) ? readdirSync(join(dotfiles, 'agents')).filter((f) => f.startsWith('himoa-')).length : 0;
    check('symlink: reviewer agents land in the linked directory', n === expectedAgents, `${n}/${expectedAgents}`);
  }
}

// --- The Codex migration removes only a 3.1.0 reference home ---------------
// It once removed `${CODEX_HOME}/himoa` whenever the path string differed from
// the current home: CODEX_HOME=$HOME deleted a user's own ~/himoa, and a second
// spelling of ~/.agents deleted the install just made, both exiting 0.
{
  const codex = (home, codexHome) => spawnSync(bin('codex'), [], { cwd: repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: codexHome }, encoding: 'utf8' });
  const home1 = freshHome();
  mkdirSync(join(home1, 'himoa'));
  writeFileSync(join(home1, 'himoa', 'README'), 'MINE\n');
  const r1 = codex(home1, home1);
  check('migration: CODEX_HOME=$HOME keeps a foreign ~/himoa', r1.status === 0 && existsSync(join(home1, 'himoa', 'README')), r1.stderr);

  const home2 = freshHome();
  const r2 = codex(home2, `${join(home2, '.agents')}/`);
  check('migration: CODEX_HOME naming ~/.agents/ keeps the fresh install', r2.status === 0 && existsSync(join(home2, '.agents/himoa/VERSION')), r2.stderr);

  const home3 = freshHome();
  mkdirSync(join(home3, '.codex/himoa/standards'), { recursive: true });
  writeFileSync(join(home3, '.codex/himoa/VERSION'), '3.1.0\n');
  codex(home3, join(home3, '.codex'));
  check('migration: a real 3.1.0 home at ~/.codex/himoa is still removed', !existsSync(join(home3, '.codex/himoa')));
}

// --- A render that fails leaves no truncated file ---------------------------
// A newline in the home path makes sed fail; writing straight to the
// destination had already emptied it, leaving a zero-byte agent file.
{
  const home = freshHome('himoa-home-\nline-');
  const r = spawnSync(bin('codex'), [], { cwd: repoRoot, env: { ...process.env, HOME: home, CODEX_HOME: join(home, '.codex') }, encoding: 'utf8' });
  const written = walk(home);
  check('render: a newline in the home path fails (non-zero exit)', r.status !== 0, `exit ${r.status}`);
  check('render: and leaves no file behind, truncated or temporary', written.length === 0, written.slice(0, 3).join(', '));
}

// --- Cross-host uninstall: shared files survive while another host needs them
{
  const home = freshHome();
  const codexHome = join(home, '.codex');
  run('codex', [], { home, codexHome });
  run('cursor', [], { home, codexHome });
  const skillsRoot = join(home, '.agents/skills');
  const nSkills = readdirSync(skillsRoot).filter((n) => n.startsWith('himoa-')).length;
  check('cross: both hosts installed, shared skills present once', nSkills === expectedSkills);

  run('codex', ['--uninstall'], { home, codexHome });
  const codexAgentsLeft = existsSync(join(codexHome, 'agents')) ? readdirSync(join(codexHome, 'agents')).filter((n) => n.startsWith('himoa-')).length : 0;
  check('cross: uninstall codex removes codex agents', codexAgentsLeft === 0);
  check('cross: uninstall codex KEEPS shared skills (cursor still installed)',
    existsSync(skillsRoot) && readdirSync(skillsRoot).filter((n) => n.startsWith('himoa-')).length === expectedSkills);
  check('cross: uninstall codex keeps cursor agents',
    readdirSync(join(home, '.cursor/agents')).filter((n) => n.startsWith('himoa-')).length === expectedAgents);

  run('cursor', ['--uninstall'], { home, codexHome });
  const skillsGone = !existsSync(skillsRoot) || readdirSync(skillsRoot).filter((n) => n.startsWith('himoa-')).length === 0;
  check('cross: uninstalling the last host removes shared skills + home', skillsGone && !existsSync(join(home, '.agents/himoa')));
}

// --- Uninstall preserves foreign files -------------------------------------
{
  const home = freshHome();
  const codexHome = join(home, '.codex');
  run('codex', [], { home, codexHome });
  const foreign = join(codexHome, 'agents', 'my-own.toml');
  writeFileSync(foreign, 'name = "mine"\n');
  run('codex', ['--uninstall'], { home, codexHome });
  check('uninstall preserves a foreign agent file', existsSync(foreign));
}

// --- Repository bootstrap (host-agnostic) ----------------------------------
{
  const home = freshHome();
  const env = { home, codexHome: join(home, '.codex') };
  const repo = mkdtempSync(join(tmpdir(), 'himoa-repo-')); tmpRoots.push(repo);
  run('cursor', ['--repo'], { ...env, cwd: repo });
  const content = existsSync(join(repo, 'AGENTS.md')) ? readFileSync(join(repo, 'AGENTS.md'), 'utf8') : '';
  check('repo: AGENTS.md created with bootstrap + truth scaffold', content.includes('himoa:bootstrap') && /Canonical commands/.test(content));
  const before = content;
  run('cursor', ['--repo'], { ...env, cwd: repo });
  check('repo: --repo is idempotent', readFileSync(join(repo, 'AGENTS.md'), 'utf8') === before);

  const repo2 = mkdtempSync(join(tmpdir(), 'himoa-repo2-')); tmpRoots.push(repo2);
  writeFileSync(join(repo2, 'AGENTS.md'), '# Mine\n\nSENTINEL-DO-NOT-LOSE\n');
  run('codex', ['--repo'], { ...env, cwd: repo2 });
  const merged = readFileSync(join(repo2, 'AGENTS.md'), 'utf8');
  check('repo: prepend preserves user content and adds bootstrap', merged.includes('SENTINEL-DO-NOT-LOSE') && merged.includes('himoa:bootstrap'));
}

// --- Copilot: repo-only bootstrap, no $HOME footprint ----------------------
{
  const copilotBin = join(pluginRoot, 'bin', 'himoa-copilot-install');
  const home = freshHome();
  const repo = mkdtempSync(join(tmpdir(), 'himoa-copilot-repo-')); tmpRoots.push(repo);
  const env = { ...process.env, HOME: home, CODEX_HOME: join(home, '.codex') };
  const r = spawnSync(copilotBin, [], { cwd: repo, env, encoding: 'utf8' });
  check('copilot: install exits 0', r.status === 0, r.stderr);
  const agentsMd = existsSync(join(repo, 'AGENTS.md')) ? readFileSync(join(repo, 'AGENTS.md'), 'utf8') : '';
  check('copilot: AGENTS.md created with bootstrap + truth scaffold', /himoa:bootstrap/.test(agentsMd) && /Canonical commands/.test(agentsMd));

  const ghAgents = join(repo, '.github/agents');
  const copAgents = existsSync(ghAgents) ? readdirSync(ghAgents).filter((n) => n.startsWith('himoa-')) : [];
  const expectedCop = readdirSync(join(adapters, 'copilot/agents')).filter((n) => n.endsWith('.agent.md')).length;
  check('copilot: reviewer agents written to .github/agents', copAgents.length === expectedCop && expectedCop > 0, `${copAgents.length}/${expectedCop}`);
  check('copilot: context-mapper excluded (not a review lens; over 30k limit)', !copAgents.some((n) => n.includes('context-mapper')));
  const ghContent = copAgents.map((n) => readFileSync(join(ghAgents, n), 'utf8')).join('\n');
  check('copilot: @HIMOA_HOME@ resolved to the canonical URL', !ghContent.includes('@HIMOA_HOME@') && ghContent.includes('github.com/jaylordibe/himoa'));
  check('copilot: writes nothing to $HOME (cloud agent)', walk(home).length === 0, `${walk(home).length} files in HOME`);

  spawnSync(copilotBin, ['--uninstall'], { cwd: repo, env, encoding: 'utf8' });
  const leftCop = existsSync(ghAgents) ? readdirSync(ghAgents).filter((n) => n.startsWith('himoa-')).length : 0;
  check('copilot: uninstall removes .github/agents/himoa-*', leftCop === 0);
  check('copilot: uninstall keeps AGENTS.md', existsSync(join(repo, 'AGENTS.md')));

  const repo2 = mkdtempSync(join(tmpdir(), 'himoa-copilot-repo2-')); tmpRoots.push(repo2);
  const rc = spawnSync(copilotBin, ['--check'], { cwd: repo2, env, encoding: 'utf8' });
  check('copilot: --check writes nothing', rc.status === 0 && !existsSync(join(repo2, 'AGENTS.md')) && !existsSync(join(repo2, '.github')));
}

// --- Gemini: machine install + repo settings.json context.fileName merge --
{
  const gbin = join(pluginRoot, 'bin', 'himoa-gemini-install');
  const home = freshHome();
  const geminiHome = join(home, '.gemini');
  const env = { ...process.env, HOME: home, GEMINI_HOME: geminiHome };
  const r = spawnSync(gbin, [], { cwd: repoRoot, env, encoding: 'utf8' });
  check('gemini: install exits 0', r.status === 0, r.stderr);
  const agents = existsSync(join(geminiHome, 'agents')) ? readdirSync(join(geminiHome, 'agents')).filter((n) => n.startsWith('himoa-')) : [];
  const cmds = existsSync(join(geminiHome, 'commands/himoa')) ? readdirSync(join(geminiHome, 'commands/himoa')).filter((n) => n.endsWith('.toml')) : [];
  const expA = readdirSync(join(adapters, 'gemini/agents')).length;
  const expC = readdirSync(join(adapters, 'gemini/commands/himoa')).length;
  check('gemini: reviewer subagents installed', agents.length === expA, `${agents.length}/${expA}`);
  check('gemini: workflow commands installed', cmds.length === expC, `${cmds.length}/${expC}`);
  check('gemini: standards home present', existsSync(join(geminiHome, 'himoa/standards')));

  const inst = snapshot(home);
  check('gemini: @HIMOA_HOME@ fully resolved', ![...inst.values()].some((c) => c.includes('@HIMOA_HOME@')));
  const gh = join(geminiHome, 'himoa');
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${esc(gh)}/(standards|templates)/([A-Za-z0-9._-]+\\.md)`, 'g');
  const dangling = [];
  for (const [f, c] of inst) for (const m of c.matchAll(re)) if (!existsSync(join(gh, m[1], m[2]))) dangling.push(`${f} -> ${m[1]}/${m[2]}`);
  check('gemini: no dangling references in installed methodology', dangling.length === 0, dangling.slice(0, 5).join('; '));

  // Gemini renders through the same literal substitution; prove it with the
  // home path that once corrupted every reference.
  {
    const awk = freshHome(AWKWARD_HOME);
    const gh2 = join(awk, '.gemini/himoa');
    const ra = spawnSync(gbin, [], { cwd: repoRoot, env: { ...process.env, HOME: awk, GEMINI_HOME: join(awk, '.gemini') }, encoding: 'utf8' });
    const all = [...snapshot(awk).values()].join('\n');
    const re2 = new RegExp(`${esc(gh2)}/(standards|templates)/([A-Za-z0-9._-]+\\.md)`, 'g');
    const refs = [...all.matchAll(re2)];
    check('gemini (awkward home): install exits 0', ra.status === 0, ra.stderr);
    check('gemini (awkward home): @HIMOA_HOME@ fully resolved', !all.includes('@HIMOA_HOME@'));
    check('gemini (awkward home): references name the real home and resolve',
      refs.length > 0 && refs.every((m) => existsSync(join(gh2, m[1], m[2]))), `${refs.length} references`);
  }
  const anyWrite = agents.some((n) => /write_file|run_shell_command/.test(readFileSync(join(geminiHome, 'agents', n), 'utf8').split('\n---\n')[0]));
  check('gemini: reviewer subagents are read-only (no write tools)', !anyWrite);

  const repo = mkdtempSync(join(tmpdir(), 'himoa-gemrepo-')); tmpRoots.push(repo);
  spawnSync(gbin, ['--repo'], { cwd: repo, env, encoding: 'utf8' });
  check('gemini: --repo writes AGENTS.md bootstrap', existsSync(join(repo, 'AGENTS.md')) && /himoa:bootstrap/.test(readFileSync(join(repo, 'AGENTS.md'), 'utf8')));
  const settings = join(repo, '.gemini/settings.json');
  check('gemini: settings.json context.fileName includes AGENTS.md', existsSync(settings) && /AGENTS\.md/.test(readFileSync(settings, 'utf8')));

  const repo2 = mkdtempSync(join(tmpdir(), 'himoa-gemrepo2-')); tmpRoots.push(repo2);
  mkdirSync(join(repo2, '.gemini'), { recursive: true });
  writeFileSync(join(repo2, '.gemini/settings.json'), JSON.stringify({ theme: 'keep-me', context: { fileName: 'GEMINI.md' } }));
  spawnSync(gbin, ['--repo'], { cwd: repo2, env, encoding: 'utf8' });
  let merged = {};
  try { merged = JSON.parse(readFileSync(join(repo2, '.gemini/settings.json'), 'utf8')); } catch { /* leave empty */ }
  check('gemini: settings merge preserves existing keys and adds AGENTS.md',
    merged.theme === 'keep-me' && Array.isArray(merged.context?.fileName) && merged.context.fileName.includes('AGENTS.md') && merged.context.fileName.includes('GEMINI.md'));

  spawnSync(gbin, ['--uninstall'], { cwd: repoRoot, env, encoding: 'utf8' });
  const leftA = existsSync(join(geminiHome, 'agents')) ? readdirSync(join(geminiHome, 'agents')).filter((n) => n.startsWith('himoa-')).length : 0;
  check('gemini: uninstall removes subagents, commands and himoa home',
    leftA === 0 && !existsSync(join(geminiHome, 'himoa')) && !existsSync(join(geminiHome, 'commands/himoa')));
}

// --- Adapter doctors assert their own exit codes ---------------------------
// Same standard as run-doctor-fixtures for himoa-doctor: a doctor whose exit
// code nobody asserts is not a check. Each must FAIL when nothing is installed
// and report OK after a correct install.
{
  const doctor = (host, envOverrides, cwd) => spawnSync(join(pluginRoot, 'bin', `himoa-${host}-doctor`), [], { cwd, env: { ...process.env, ...envOverrides }, encoding: 'utf8' });
  const install = (host, envOverrides, cwd) => spawnSync(join(pluginRoot, 'bin', `himoa-${host}-install`), [], { cwd, env: { ...process.env, ...envOverrides }, encoding: 'utf8' });

  for (const host of ['codex', 'cursor', 'gemini']) {
    const home = freshHome();
    const env = { HOME: home, CODEX_HOME: join(home, '.codex'), GEMINI_HOME: join(home, '.gemini') };
    const notRepo = mkdtempSync(join(tmpdir(), 'himoa-doc-')); tmpRoots.push(notRepo);
    const before = doctor(host, env, notRepo);
    check(`doctor: ${host} FAILs (exit 1) when not installed`, before.status === 1, `exit ${before.status}`);
    install(host, env, repoRoot);
    const after = doctor(host, env, notRepo);
    check(`doctor: ${host} reports OK (exit 0) after install`, after.status === 0, `exit ${after.status}`);
  }

  // Copilot is repo-only: FAILs with no AGENTS.md, OK after --repo bootstrap.
  const home = freshHome();
  const env = { HOME: home, CODEX_HOME: join(home, '.codex') };
  const repo = mkdtempSync(join(tmpdir(), 'himoa-copdoc-')); tmpRoots.push(repo);
  const before = doctor('copilot', env, repo);
  check('doctor: copilot FAILs (exit 1) with no AGENTS.md', before.status === 1, `exit ${before.status}`);
  spawnSync(join(pluginRoot, 'bin', 'himoa-copilot-install'), [], { cwd: repo, env: { ...process.env, ...env }, encoding: 'utf8' });
  const after = doctor('copilot', env, repo);
  check('doctor: copilot reports OK (exit 0) after bootstrap', after.status === 0, `exit ${after.status}`);
}

// --- Structural guarantees the projection carries onto each host -----------
{
  const humanOnly = ['gate-design', 'gate-approve', 'gate-implement', 'gate-review', 'gate-validate', 'work-item', 'write-ticket'];
  for (const s of humanOnly) {
    const skill = readFileSync(join(adapters, 'skills', `himoa-${s}`, 'SKILL.md'), 'utf8');
    check(`shape: ${s} SKILL.md forbids model invocation (Cursor/Claude)`, /^disable-model-invocation: true$/m.test(skill));
    const yaml = readFileSync(join(adapters, 'skills', `himoa-${s}`, 'agents', 'openai.yaml'), 'utf8');
    check(`shape: ${s} forbids implicit invocation (Codex)`, /allow_implicit_invocation:\s*false/.test(yaml));
  }
  for (const s of ['domain-auth', 'domain-debugging']) {
    const skill = readFileSync(join(adapters, 'skills', `himoa-${s}`, 'SKILL.md'), 'utf8');
    check(`shape: ${s} is model-invocable (no disable flag)`, !/disable-model-invocation/.test(skill));
  }
  for (const f of readdirSync(join(adapters, 'codex/agents'))) {
    check(`shape: codex ${f} is read-only`, /sandbox_mode\s*=\s*"read-only"/.test(readFileSync(join(adapters, 'codex/agents', f), 'utf8')));
  }
  for (const f of readdirSync(join(adapters, 'cursor/agents'))) {
    check(`shape: cursor ${f} is readonly`, /^readonly: true$/m.test(readFileSync(join(adapters, 'cursor/agents', f), 'utf8')));
  }
  const copAgents = readdirSync(join(adapters, 'copilot/agents'));
  check('shape: copilot agents exclude context-mapper (not a review lens; 30k limit)', !copAgents.some((n) => n.includes('context-mapper')));
  for (const f of copAgents) {
    check(`shape: copilot ${f} has name+description`, /^---\nname: himoa-[a-z0-9-]+\ndescription: .+/.test(readFileSync(join(adapters, 'copilot/agents', f), 'utf8')));
  }
  for (const f of readdirSync(join(adapters, 'gemini/agents'))) {
    const fm = readFileSync(join(adapters, 'gemini/agents', f), 'utf8').split('\n---\n')[0];
    check(`shape: gemini ${f} declares read-only tools`, /\ntools:\n/.test(fm) && !/write_file|run_shell_command/.test(fm));
  }
  for (const f of readdirSync(join(adapters, 'gemini/commands/himoa'))) {
    const c = readFileSync(join(adapters, 'gemini/commands/himoa', f), 'utf8');
    check(`shape: gemini command ${f} has description + prompt`, /\ndescription = /.test(c) && /\nprompt = '''/.test(c));
  }
}

for (const d of tmpRoots) rmSync(d, { recursive: true, force: true });
console.log('');
if (failures > 0) { console.error(`FAIL — ${failures} check(s) failed.`); process.exit(1); }
console.log('PASS — Codex and Cursor installers, bootstrap and projection guarantees hold.');
