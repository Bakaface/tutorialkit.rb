# Tutorial Authoring Guide

You are authoring an interactive Ruby on Rails tutorial that runs entirely in the browser using WebAssembly. Tutorial content lives in `src/content/tutorial/`. The Rails WASM runtime, templates, and infrastructure are already set up — your job is to write lessons.

## Project Layout

```
src/content/tutorial/     ← Your tutorial content (lessons, parts, chapters)
src/templates/            ← WebContainer file templates (base app states)
ruby-wasm/Gemfile         ← Gems compiled into the WASM binary
bin/build-pack            ← Repack WASM after Gemfile changes (npm run pack:wasm, fast)
bin/build-wasm            ← Legacy full WASM rebuild (npm run build:wasm, 5-20 min)
```

## Key Constraints

- **All Rails app files go under `workspace/`** — this is the WASI filesystem boundary
- **Each lesson should be self-contained** — don't rely on user actions from previous lessons persisting
- **Gems require a WASM repack** — edit `ruby-wasm/Gemfile`, then run `npm run pack:wasm` (~1-4 min; needs host Ruby 3.3.x with RubyGems >= 3.6 < 4, Rust, and the `gh` CLI — the script preflights and explains). `npm run build:wasm` is the slow legacy fallback. See `rails-file-management`
- **Outbound HTTP works** (`Net::HTTP`, Faraday, etc.) via JS fetch bridge — CORS restrictions apply, see `rails-wasm-author-constraints`
- **No threading or process spawning** from Ruby — see `rails-wasm-author-constraints`
- **Database resets on page reload** — use `prepareCommands` with `db:prepare` for lessons that need data
- **Use `node scripts/rails.js <cmd>`** in frontmatter commands, not bare `rails <cmd>`

## Development

```bash
npm install         # Install dependencies (or pnpm/yarn/bun — whichever this project uses)
npm run pack:wasm   # Build the Ruby WASM binary (first run, and after Gemfile changes)
npm run dev         # Start dev server at http://localhost:4321/
```

## Before Creating or Modifying Lessons

**MANDATORY:** Always invoke these skills before writing any lesson content:

- `rails-lesson-recipes` — lesson patterns, directory structures, and post-creation checklist
- `rails-file-management` — `_files/`, `_solution/`, template organization, and the file layering model
- `tutorial-lesson-config` — frontmatter options, inheritance rules, and invalid-combination constraints

Do NOT create lessons without loading these skills first. Incorrect structure causes silent runtime failures.

## Additional Skills

| Question | Skill |
|----------|-------|
| How do I start a new tutorial from scratch? | `tutorial-quickstart` |
| How do I structure parts, chapters, and lessons? | `tutorial-content-structure` |
| Can I teach feature X in WASM? | `rails-wasm-author-constraints` |
