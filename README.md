<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="media/logo-white.svg">
    <img src="media/logo.png" alt="tutorialkit.rb logo" width="440px" height="auto" />
  </picture>
  <br>
  Create interactive Ruby on Rails tutorials that run entirely in the browser.<br>
  No server. No Docker. No setup friction. Just open a URL and start learning.
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=S_NKftfM1T4">RailsConf 2025 Talk</a>
  &middot;
  <a href="https://www.youtube.com/watch?v=RUbAaEluDVA">EuRuKo 2025 Talk</a>
  &middot;
  <a href="https://tutorialkit.dev/guides/about">Original Framework Docs</a>
</p>

<hr>

**TutorialKit.rb** is a fork of [TutorialKit](https://tutorialkit.dev) by StackBlitz, extended to run a full Ruby on Rails environment in the browser via WebAssembly. It was built at [Evil Martians](https://evilmartians.com) and funded by the [Ruby Association Grant 2025](https://www.ruby.or.jp/en/news/20241031).

Learners open a URL and get a live Rails 8 app with an editor, terminal, and browser preview — all running client-side. Tutorial authors write lessons in Markdown with frontmatter config. No backend infrastructure required.

## Quick Start

```bash
# Scaffold a new tutorial project
npx create-tutorialkit-rb my-tutorial
cd my-tutorial

# Build the WASM binary — pick ONE of the two approaches:
npm run build:wasm    # Full build from source (5-20 min, supports C extension gems)
npm run pack:wasm     # Pack gems onto prebuilt base binary (~30s, pure-Ruby gems only)

# Start the dev server
npm run dev
```

You only need to rebuild when you change the Gemfile. Day-to-day lesson authoring (Markdown, Ruby app code) requires no WASM rebuilds.

Open `http://localhost:4321/` — you'll see the tutorial UI with a live Rails app running in your browser.

## How It Works

TutorialKit.rb runs a three-layer stack entirely in the browser:

```
Browser (Astro/React UI)
  └─ WebContainer (virtual Node.js)
       └─ Ruby 3.3 + Rails 8.0 (WebAssembly)
```

**Browser layer** — Astro/React components render the tutorial UI: editor panels, file tree, terminal, and a preview iframe.

**WebContainer layer** — StackBlitz's [WebContainer](https://webcontainers.io) provides a virtual Node.js environment. Express.js bridges HTTP requests between the preview iframe and Rails via Rack.

**Ruby/Rails layer** — A custom Ruby 3.3 binary compiled to WebAssembly with gems embedded in the binary's virtual filesystem. Boot takes 2-5 seconds because gem loading reads from linear memory (microseconds per file) rather than crossing the WASM-to-JS boundary.

### What works

Full MVC, ActiveRecord (via PGLite), generators (`rails generate`), forms, sessions, flash messages, Turbo/Hotwire, Propshaft asset pipeline, `rails new` with built-in authentication, IRB console, and outbound HTTP (Net::HTTP, Faraday, HTTParty — routed through a JS fetch bridge).

### Key limitations

Single-threaded (no real threads), no raw sockets (HTTP works via fetch bridge), no process spawning (commands run inline), no streaming HTTP, CORS proxy required for external APIs.

## Building the WASM Binary

The WASM binary (~80MB) contains the Ruby interpreter, stdlib, and all gems. There are two build strategies:

### Monolithic build (`build:wasm`)

Compiles Ruby, all gems (including C extensions), and the app into a single WASM binary. This is the **robust, proven approach**.

```bash
npm run build:wasm          # Incremental build (5-20 min)
npm run build:wasm:clean    # Full clean rebuild
```

Use this when your tutorial gems include WASM-compatible C extensions (e.g., `bcrypt`, `websocket-driver`). C extensions must be cross-compiled into the binary by `rbwasm build` — they can't be added after the fact.

### Dynamic packing (`pack:wasm`) — experimental

Downloads a prebuilt base binary (Ruby + stdlib + C extensions) from [GitHub Releases](../../releases), then packs your pure-Ruby gems on top via `wasi-vfs pack`. Functionally identical to the monolithic build, but **significantly faster on the first build** (~30 seconds vs 5-20 minutes).

```bash
npm run pack:wasm           # Pack gems onto base (~30s)
npm run pack:wasm:clean     # Clean + repack
```

Limitations: still experimental (basic workflows work, but `build:wasm` is more battle-tested), and **cannot include C extension gems** beyond what's already in the base binary — those require a full monolithic build because `rbwasm build` must cross-compile them from C source to WASM.

### Why a custom binary?

The official `@ruby/3.3-wasm-wasi` binary cannot run Rails. Its POSIX function stubs (`fchmod`, `chmod`, etc.) crash at runtime with `NotImplementedError: false()`. The custom binary built via `rbwasm build` disables these code paths at **compile time** using autoconf flags.

## Tutorial Authoring

Tutorials are organized hierarchically: **Parts** > **Chapters** > **Lessons**. Each lesson is a directory with a `content.md` (Markdown + frontmatter) and optional `_files/` (starter code) and `_solution/` (solution code) directories.

```
src/content/tutorial/
  1-getting-started/          # Part
    meta.md
    1-introduction/           # Chapter
      meta.md
      1-welcome/              # Lesson
        content.md
        _files/
          app/controllers/home_controller.rb
        _solution/
          app/controllers/home_controller.rb
```

Lessons support live code editing, terminal commands, database operations, IRB console, and preview — all configured via frontmatter. See the [TutorialKit docs](https://tutorialkit.dev/guides/about) for the full content authoring guide.

### Template Rails app

The scaffolded project includes a template Rails 8 app with:
- Built-in authentication with single-click auth flow
- BEM-based CSS design system
- PGLite database (PostgreSQL-compatible, runs in-browser)
- Turbo/Hotwire integration

## Outbound HTTP

Rails code can make real HTTP requests to external APIs. The bridge routes `Net::HTTP` calls through JavaScript's `fetch()`:

```
Ruby Net::HTTP → JS fetch bridge → Browser fetch → CORS proxy → External API
```

A Cloudflare Worker CORS proxy is included in `packages/template/cors-proxy/`. Deploy it with:

```bash
cd packages/template/cors-proxy
npx wrangler login
npm run deploy
```

Configure allowed hosts in `wrangler.toml`. Run the dev server with the proxy:

```bash
npm run proxy:dev    # Starts dev server + CORS proxy together
```

See `packages/template/cors-proxy/` for full setup.

## Claude Code Integration

The template includes 6 Claude Code [skills](https://docs.anthropic.com/en/docs/claude-code/skills) in `packages/template/.claude/skills/` that provide domain knowledge for AI-assisted tutorial authoring:

| Skill | What it knows |
|-------|---------------|
| `tutorial-quickstart` | End-to-end workflow from scaffold to deployment |
| `tutorial-lesson-config` | All frontmatter options and inheritance rules |
| `tutorial-content-structure` | Parts/chapters/lessons hierarchy and Markdown features |
| `rails-lesson-recipes` | Five tested lesson blueprints (terminal, code-editing, database, full-app, console) |
| `rails-file-management` | `_files/`, `_solution/`, templates, workspace paths |
| `rails-wasm-author-constraints` | What works in WASM, gem compatibility, PGLite behavior |

When working with Claude Code in a scaffolded tutorial, these skills activate automatically based on context — ask about lesson structure, WASM compatibility, or deployment and the relevant skill provides authoritative guidance.

## Deployment

### Tutorial site

Build the static site and deploy to any static hosting provider (Netlify, Vercel, Cloudflare Pages, etc.):

```bash
npm run build
```

The host must serve pages with cross-origin isolation headers:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### NPM packages

Seven packages are published under the `@tutorialkit-rb` scope. Releases are automated via GitHub Actions:

1. Trigger the **Release** workflow with a version number
2. It creates a version-bump PR with changelogs
3. Merge the PR to publish to npm and create a git tag

The release workflow is defined in `.github/workflows/release.yaml`.

### CI/CD workflows

| Workflow | Purpose |
|----------|---------|
| `release.yaml` | Version bump PR + npm publish + git tag |
| `publish-ruby-base.yaml` | Build and publish base WASM binary to GitHub Releases |
| `deploy-cors-proxy.yaml` | Deploy CORS proxy to Cloudflare Workers |

## Smoke Tests

Validate a WASM binary in a Node.js environment locally:

```bash
npm run smoke    # Runs VM init, Rails bootstrap, HTTP bridge tests
```

Tests cover: WASM compilation, Rails boot, `rails new`, scaffold generation, Express-to-Rack bridge, and outbound HTTP. Takes ~2.5 seconds.

## Development (monorepo)

For contributors working on TutorialKit.rb itself (not tutorial authors):

```bash
# Prerequisites: Node.js 18.18+, pnpm 8.15.6
pnpm install
pnpm run build    # Build all core packages
pnpm run dev      # Dev mode with hot reloading (localhost:4321)
```

### Monorepo packages

| Package | npm | Purpose |
|---------|-----|---------|
| `@tutorialkit-rb/astro` | Published | Astro integration and components |
| `@tutorialkit-rb/react` | Published | React UI (editor, terminal, file tree, preview) |
| `@tutorialkit-rb/runtime` | Published | WebContainer lifecycle and lesson execution |
| `@tutorialkit-rb/theme` | Published | Theming system and CSS |
| `@tutorialkit-rb/types` | Published | TypeScript type definitions |
| `@tutorialkit-rb/cli` | Published | CLI tooling |
| `create-tutorialkit-rb` | Published | `npx create-tutorialkit-rb` scaffolder |
| `packages/template` | Internal | Template project with Rails WASM runtime |

## License

MIT
