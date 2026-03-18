#!/usr/bin/env bash
# setup-worktree.sh — Prepare a git worktree for development.
#
# Symlinks expensive build artifacts (Ruby WASM cache, dist) from the main repo
# and installs dependencies so that `pnpm run template:dev`, `pnpm run template:smoke`,
# and `pnpm run template:build:wasm` all work from the worktree.
#
# Usage:
#   scripts/setup-worktree.sh                  # auto-detect worktree
#   scripts/setup-worktree.sh /path/to/worktree
#   scripts/setup-worktree.sh --skip-deps      # skip pnpm install

set -euo pipefail

# ─── Defaults ────────────────────────────────────────────────────────────────

SKIP_DEPS=false
WORKTREE_PATH=""

# ─── Usage ───────────────────────────────────────────────────────────────────

usage() {
  cat <<'USAGE'
Usage: setup-worktree.sh [worktree-path] [options]

Prepare a git worktree for tutorialkit.rb development. Symlinks Ruby WASM
build cache from the main repo and installs dependencies.

Arguments:
  [worktree-path]       Path to the worktree (default: current directory).

Options:
  --skip-deps           Skip pnpm install.
  -h, --help            Show this help message.

Examples:
  # Run from inside a worktree
  ./scripts/setup-worktree.sh

  # Bootstrap a specific worktree
  ./scripts/setup-worktree.sh ../my-worktree

  # Re-run without reinstalling deps
  ./scripts/setup-worktree.sh --skip-deps
USAGE
  exit "${1:-0}"
}

# ─── Argument parsing ────────────────────────────────────────────────────────

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)       usage 0 ;;
    --skip-deps)     SKIP_DEPS=true; shift ;;
    -*)
      echo "Error: unknown option: $1" >&2
      usage 1 ;;
    *)
      if [[ -z "$WORKTREE_PATH" ]]; then
        WORKTREE_PATH="$1"
      else
        echo "Error: unexpected argument '$1'" >&2
        usage 1
      fi
      shift ;;
  esac
done

# Default to current directory
if [[ -z "$WORKTREE_PATH" ]]; then
  WORKTREE_PATH="$(pwd)"
fi

# Resolve to absolute path
WORKTREE_PATH="$(cd "$WORKTREE_PATH" 2>/dev/null && pwd -P)" || {
  echo "Error: path does not exist: $WORKTREE_PATH" >&2
  exit 1
}

# ─── Detect main repo ───────────────────────────────────────────────────────

MAIN_REPO="$(git -C "$WORKTREE_PATH" worktree list | head -1 | awk '{print $1}')"

if [[ "$MAIN_REPO" == "$WORKTREE_PATH" ]]; then
  echo "Error: $WORKTREE_PATH is the main repo, not a worktree." >&2
  echo "This script is only needed for worktrees." >&2
  exit 1
fi

echo "┌──────────────────────────────────────────────────────┐"
echo "│  setup-worktree                                      │"
echo "└──────────────────────────────────────────────────────┘"
echo ""
echo "  Worktree:   $WORKTREE_PATH"
echo "  Main repo:  $MAIN_REPO"
echo ""

# ─── Helpers ─────────────────────────────────────────────────────────────────

# Symlink a path from the main repo into the worktree.
# Usage: ensure_symlink <relative-path>
# If the source doesn't exist in the main repo, it's skipped.
# If the target already exists (and isn't a symlink to the right place), it's replaced.
ensure_symlink() {
  local rel_path="$1"
  local src="$MAIN_REPO/$rel_path"
  local dst="$WORKTREE_PATH/$rel_path"

  if [[ ! -e "$src" && ! -L "$src" ]]; then
    echo "  [skip] $rel_path (not in main repo)"
    return
  fi

  # Already a correct symlink
  if [[ -L "$dst" ]]; then
    local current_target
    current_target="$(readlink "$dst")"
    if [[ "$current_target" == "$src" ]]; then
      echo "  [ok]   $rel_path (already linked)"
      return
    fi
    # Wrong target — remove and re-link
    rm "$dst"
  elif [[ -e "$dst" ]]; then
    # Real file/dir exists — back it up and replace
    echo "  [warn] $rel_path exists, replacing with symlink"
    rm -rf "$dst"
  fi

  mkdir -p "$(dirname "$dst")"
  ln -s "$src" "$dst"
  echo "  [link] $rel_path"
}

# ─── Step 1: Ruby WASM build cache (symlinks) ───────────────────────────────

echo "── Step 1: Ruby WASM build cache ──"
echo ""

# These directories are expensive to rebuild (~1.5 GB total).
# Symlink them so the worktree reuses the main repo's cache.
WASM_DIRS=(
  "packages/template/ruby-wasm/build"
  "packages/template/ruby-wasm/dist"
  "packages/template/ruby-wasm/rubies"
  "packages/template/ruby-wasm/tmp"
  "packages/template/ruby-wasm/vendor"
  "packages/template/ruby-wasm/.bundle"
)

for dir in "${WASM_DIRS[@]}"; do
  ensure_symlink "$dir"
done

echo ""

# ─── Step 2: Built WASM binary in public/ ───────────────────────────────────

echo "── Step 2: Public WASM binary ──"
echo ""

# The dev server serves ruby.wasm from packages/template/public/.
# Symlink so the worktree picks up the already-built binary.
ensure_symlink "packages/template/public/ruby.wasm"
ensure_symlink "packages/template/public/ruby.wasm.hash"

echo ""

# ─── Step 3: Dependencies ───────────────────────────────────────────────────

echo "── Step 3: Dependencies ──"
echo ""

if [[ "$SKIP_DEPS" == true ]]; then
  echo "  Skipped (--skip-deps)"
else
  echo "  Running pnpm install..."
  (cd "$WORKTREE_PATH" && pnpm install --frozen-lockfile 2>&1 | tail -5)
  echo "  Dependencies installed"

fi

# ─── Done ────────────────────────────────────────────────────────────────────

echo ""
echo "Worktree is ready at $WORKTREE_PATH"
echo ""
echo "  pnpm run template:dev        # Start dev server"
echo "  pnpm run template:smoke      # Run smoke tests"
echo "  pnpm run template:build:wasm # Build WASM (uses shared cache)"
