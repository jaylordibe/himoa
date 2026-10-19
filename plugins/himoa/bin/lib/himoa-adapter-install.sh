# shellcheck shell=bash
#
# Shared installer logic for Himoa's non-Claude adapters (Codex, Cursor).
#
# WHY A SHARED LIB
# ----------------
# Codex and Cursor install the SAME shared artefacts — the skills at
# ~/.agents/skills and the standards/templates at the neutral home ~/.agents/himoa
# (both hosts read those paths natively) — and differ only in where their
# read-only reviewer agents go. Two independently edited installers would drift;
# this is the one place the install logic lives. Each wrapper sets HIMOA_HOST and
# BIN_DIR, then sources this file.
#
# It writes only Himoa-owned paths (himoa-* and the himoa/ home), is idempotent,
# has --check / --uninstall / --repo, and honours HOME (and CODEX_HOME for the
# Codex agents dir) — which is what lets it be tested against an isolated fake
# HOME. bash 3.2 compatible.

# True when a destination, or any directory between it and the Himoa-owned root
# it belongs to, is a symlink (a dangling one included). Writing through one
# lands outside Himoa's paths: an existing himoa-reviewer.toml linked to some
# other file was overwritten with a reviewer agent, and the install exited 0.
# Directories ABOVE the owned root (~/.agents, ~/.codex, .github/agents) may be
# symlinks — a dotfiles setup that links them is legitimate and keeps working.
# Also true when the destination file is itself a directory: the render's `mv`
# would move the file inside it, leaving the expected file absent while the
# install exited 0. The directory and its contents are left as they are.
# Args: destination, owned root (the destination itself for a single file).
himoa_dest_unsafe() {
  local p="$1"
  [ -d "$p" ] && return 0
  while [ -n "$p" ]; do
    [ -L "$p" ] && return 0
    [ "$p" = "$2" ] && return 1
    case "$p" in */*) p=${p%/*} ;; *) return 1 ;; esac
  done
  return 1
}

# Render a methodology file into place with @HIMOA_HOME@ replaced by a literal
# value. The value is escaped for the sed replacement: an unescaped `&` in a
# home path wrote the token itself back into every reference, and a `\` was
# silently dropped, both with exit 0. Rendered beside the destination and moved
# into place, so a failed render (a value containing a newline makes sed fail)
# leaves the previous file whole rather than truncated to zero bytes.
# Args: source, destination, value.
himoa_render() {
  local value tmp="$2.himoa-tmp.$$"
  value=$(printf '%s' "$3" | sed 's/[\\&|]/\\&/g')
  sed "s|@HIMOA_HOME@|$value|g" "$1" > "$tmp" || { rm -f "$tmp"; return 1; }
  mv -f "$tmp" "$2"
}

# Refuse when a repository file the bootstrap would rewrite is a symlink. The
# rewrite replaces the link with a regular file, so a deliberate link (AGENTS.md
# -> CLAUDE.md) silently stops being one; a dangling link is written through.
# Nothing is changed: the link and its target are both left as they are.
# Also refused when the file is a directory: the prepend's `cat` failed, the run
# still reported "Prepended" with exit 0, and nothing was written.
himoa_refuse_unsafe_repo_file() {
  if [ -L "$1" ]; then
    printf 'himoa: ./%s is a symlink; nothing was changed. Add the Himoa bootstrap to the file it points at yourself, or replace the link with a regular file and re-run.\n' "$1" >&2
    return 0
  fi
  [ -d "$1" ] || return 1
  printf 'himoa: ./%s is a directory; nothing was changed. Move or rename it and re-run.\n' "$1" >&2
  return 0
}

# Create or safely extend ./AGENTS.md with the Himoa bootstrap + repository-truth
# scaffold. Never destroys existing content. Args: source_root, reference_root,
# dry(0/1). Shared by every adapter's repository bootstrap (Codex, Cursor,
# Copilot), so the one repo-truth home is written the same way everywhere.
himoa_repo_bootstrap() {
  local source_root="$1" reference_root="$2" dry="$3"
  local boot="$source_root/AGENTS.himoa.md"
  local scaffold="$reference_root/AGENTS.md.template"
  [ -f "$boot" ] || { printf 'himoa: missing bootstrap %s\n' "$boot" >&2; return 1; }
  himoa_refuse_unsafe_repo_file "AGENTS.md" && return 1
  if [ ! -e "AGENTS.md" ]; then
    if [ "$dry" = "1" ]; then printf '%s\n' "would create ./AGENTS.md (Himoa bootstrap + repository-truth scaffold)"; return 0; fi
    { cat "$boot"; printf '\n\n'; [ -f "$scaffold" ] && cat "$scaffold"; } > "AGENTS.md"
    printf '%s\n' "Created ./AGENTS.md — Himoa bootstrap plus a repository-truth scaffold. Fill it from evidence and commit it."
    return 0
  fi
  if grep -q 'himoa:bootstrap' "AGENTS.md" 2>/dev/null; then printf '%s\n' "./AGENTS.md already carries the Himoa bootstrap — nothing to do."; return 0; fi
  if [ "$dry" = "1" ]; then printf '%s\n' "would prepend the Himoa bootstrap to ./AGENTS.md (existing content preserved)"; return 0; fi
  local tmp; tmp=$(mktemp "${TMPDIR:-/tmp}/himoa-agents.XXXXXX")
  { cat "$boot"; printf '\n\n---\n\n'; cat "AGENTS.md"; } > "$tmp" && mv "$tmp" "AGENTS.md"
  printf '%s\n' "Prepended the Himoa bootstrap to ./AGENTS.md; existing content preserved below it."
  return 0
}

himoa_adapter_main() {
  local host="$HIMOA_HOST"
  local self_dir="$BIN_DIR"

  local source_root="${CLAUDE_PLUGIN_ROOT:-$self_dir/..}/adapters"
  [ -d "$source_root" ] || source_root="$self_dir/../adapters"
  if [ ! -d "$source_root" ]; then
    printf 'himoa-%s-install: cannot find adapters/ — run from an installed plugin or a repo clone.\n' "$host" >&2
    return 1
  fi
  source_root=$(cd "$source_root" && pwd)
  local reference_root="${CLAUDE_PLUGIN_ROOT:-$self_dir/..}/reference"
  [ -d "$reference_root" ] || reference_root="$self_dir/../reference"

  # Shared, host-neutral: both Codex and Cursor read these paths.
  local skills_dst="$HOME/.agents/skills"
  local himoa_home="$HOME/.agents/himoa"

  # Host-specific reviewer agents.
  local agents_src agents_dst other_agents_dst
  if [ "$host" = "codex" ]; then
    agents_src="$source_root/codex/agents"
    agents_dst="${CODEX_HOME:-$HOME/.codex}/agents"
    other_agents_dst="$HOME/.cursor/agents"
  else
    agents_src="$source_root/cursor/agents"
    agents_dst="$HOME/.cursor/agents"
    other_agents_dst="${CODEX_HOME:-$HOME/.codex}/agents"
  fi

  local mode="install"
  case "${1:-}" in
    --check) mode="check" ;;
    --uninstall) mode="uninstall" ;;
    --repo) mode="repo"; [ "${2:-}" = "--check" ] && mode="repo-check" ;;
    "") : ;;
    -h|--help)
      printf 'usage: himoa-%s-install [--check | --uninstall | --repo [--check]]\n' "$host"
      printf '  (no flag)      install/refresh the machine-level adapter (idempotent)\n'
      printf '  --check        dry run: print destinations, write nothing\n'
      printf '  --uninstall    remove this host'\''s reviewer agents (and shared files if no other Himoa host remains)\n'
      printf '  --repo         bootstrap ./AGENTS.md in this repository (create or prepend, never destroy)\n'
      return 0 ;;
    *) printf 'himoa-%s-install: unknown argument %s\n' "$host" "$1" >&2; return 2 ;;
  esac

  local version; version=$(cat "$source_root/VERSION" 2>/dev/null || printf 'unknown')
  say() { printf '%s\n' "$1"; }

  # Args: source, destination, the Himoa-owned root the destination sits under.
  # In the preflight pass nothing is written; each exact destination is checked.
  local linked=""
  install_file() {
    if [ "$mode" = "preflight" ]; then
      if himoa_dest_unsafe "$2" "$3"; then linked="${linked}  $2
"; fi
      return 0
    fi
    if [ "$mode" = "check" ]; then say "  would write  $2"; return; fi
    mkdir -p "$(dirname "$2")"
    himoa_render "$1" "$2" "$himoa_home"
  }
  # Args: source dir, destination dir, owned root (defaults to the destination).
  install_tree() {
    local rel
    while IFS= read -r rel; do install_file "$1/$rel" "$2/$rel" "${3:-$2}"; done < <(cd "$1" && find . -type f | sed 's|^\./||')
  }
  install_all() {
    local f d
    for f in "$agents_src"/himoa-*; do [ -e "$f" ] && install_file "$f" "$agents_dst/$(basename "$f")" "$agents_dst/$(basename "$f")"; done
    for d in "$source_root"/skills/himoa-*; do [ -e "$d" ] && install_tree "$d" "$skills_dst/$(basename "$d")"; done
    install_tree "$source_root/standards" "$himoa_home/standards" "$himoa_home"
    install_tree "$source_root/templates" "$himoa_home/templates" "$himoa_home"
    install_file "$source_root/VERSION" "$himoa_home/VERSION" "$himoa_home"
  }

  # --- Repository bootstrap ---
  if [ "$mode" = "repo" ] || [ "$mode" = "repo-check" ]; then
    local dry=0; [ "$mode" = "repo-check" ] && dry=1
    himoa_repo_bootstrap "$source_root" "$reference_root" "$dry"
    return $?
  fi

  # --- Uninstall ---
  if [ "$mode" = "uninstall" ]; then
    say "Himoa ${host} adapter — uninstall (removes only Himoa-owned files)"
    if [ -d "$agents_dst" ]; then for f in "$agents_dst"/himoa-*; do [ -e "$f" ] && rm -rf "$f"; done; fi
    # Shared skills/home are removed only if no OTHER Himoa host still needs them.
    local other=0
    if [ -d "$other_agents_dst" ]; then for f in "$other_agents_dst"/himoa-*; do [ -e "$f" ] && other=1; done; fi
    if [ "$other" = "0" ]; then
      if [ -d "$skills_dst" ]; then for d in "$skills_dst"/himoa-*; do [ -e "$d" ] && rm -rf "$d"; done; fi
      rm -rf "$himoa_home"
      say "Removed this host's reviewer agents and the shared skills/standards (no other Himoa host present)."
    else
      say "Removed this host's reviewer agents; kept the shared skills/standards, which the other installed Himoa host still uses."
    fi
    say "AGENTS.md and everything not prefixed himoa- were left untouched."
    return 0
  fi

  # --- Install / check ---
  say "Himoa ${host} adapter ${version} — ${mode}"
  say "Source: $source_root"
  say ""
  say "Destinations (Himoa-owned only):"
  say "  skills     $skills_dst/himoa-*        (shared)"
  say "  reviewers  $agents_dst/himoa-*"
  say "  reference  $himoa_home               (standards, templates, VERSION; shared)"
  say ""

  # Every destination is checked before any is written, so a refusal leaves the
  # previous install whole rather than half-refreshed.
  local requested="$mode"
  mode="preflight"; install_all; mode="$requested"
  if [ -n "$linked" ]; then
    printf 'himoa-%s-install: these destinations are symlinks or directories, or sit under a symlinked Himoa directory; nothing was written:\n%s' "$host" "$linked" >&2
    printf 'A link would be written through and a directory would swallow the file. Remove them (re-link afterwards if a link is yours on purpose) and re-run.\n' >&2
    return 1
  fi
  install_all

  # Migration: 3.1.0 installed the Codex reference home at ~/.codex/himoa; the
  # neutral home is now ~/.agents/himoa. Remove the stale one so it cannot be
  # read in preference to the current standards. Only a directory that is not
  # the current home under another spelling (`-ef`), and that carries what
  # 3.1.0 wrote there (VERSION and standards/): a string comparison let
  # CODEX_HOME=$HOME delete a user's own ~/himoa, and CODEX_HOME=~/.agents/
  # delete the install just made, both reporting success.
  if [ "$host" = "codex" ] && [ "$mode" != "check" ]; then
    local legacy="${CODEX_HOME:-$HOME/.codex}/himoa"
    if [ -d "$legacy" ] && [ ! "$legacy" -ef "$himoa_home" ] \
      && [ -f "$legacy/VERSION" ] && [ -d "$legacy/standards" ]; then
      rm -rf "$legacy"
    fi
  fi

  say ""
  if [ "$mode" = "check" ]; then
    say "Dry run only — nothing was written."
  else
    say "Installed Himoa ${version} for ${host}. Verify with: himoa-${host}-doctor"
    say "Nothing outside the Himoa-owned paths above was created or modified."
  fi
  return 0
}
