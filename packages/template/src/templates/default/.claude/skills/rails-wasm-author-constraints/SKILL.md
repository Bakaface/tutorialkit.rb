---
name: rails-wasm-author-constraints
description: |
  Use this skill whenever checking whether a Rails feature, gem, or pattern works in the
  WASM tutorial environment. Trigger when the user says 'does X work in WASM', 'can I use
  this gem', 'gem compatibility', 'WASM limitation', 'what works', 'what doesn't work',
  'supported features', 'PGLite', 'database persistence', 'threading', 'Net::HTTP',
  'ActionCable', 'background jobs', 'WebSockets', 'can I teach X', or asks about any
  Rails capability in the browser environment — even if they don't explicitly mention WASM
  or constraints. This skill contains the authoritative compatibility matrix for this
  specific WASM runtime — which features work, which are shimmed, which are impossible —
  plus gem compatibility tiers, PGLite behavior, and boot timing. General Ruby/Rails
  knowledge is insufficient here; the WASM environment has unique constraints that cannot
  be guessed. Do NOT use for file organization (use rails-file-management) or lesson
  frontmatter (use tutorial-lesson-config).
---

# Rails WASM Author Constraints

What works, what doesn't, and how to design lessons around the WASM environment.

## Quick Reference: What Can I Teach?

| Rails Feature | Works? | Notes |
|---------------|--------|-------|
| ActiveRecord (CRUD, queries, scopes) | Yes | Full support via PGLite |
| Migrations & schema management | Yes | Standard `rails db:migrate` |
| Controllers & routing | Yes | Full support |
| Views (ERB templates) | Yes | Full support |
| Form helpers & validations | Yes | Full support |
| Model associations | Yes | `has_many`, `belongs_to`, etc. |
| Scaffolding & generators | Yes | `rails generate scaffold`, etc. |
| Asset pipeline (Propshaft) | Yes | Importmaps, Stimulus, Turbo |
| Rails console | Yes | Interactive IRB via custom bridge |
| Authentication (basic) | Yes | `has_secure_password`, session-based |
| ActionMailer (define mailers) | Partial | Can define/configure but delivery is a no-op |
| Active Storage (upload) | Partial | Upload works but image processing is a no-op |
| Background jobs | No | Single-threaded; Solid Queue won't process |
| ActionCable / WebSockets | No | No `IO.select`, no real socket support |
| External HTTP requests | No | `Net::HTTP`, `open-uri` are stubbed |
| Threads / parallel processing | No | `Thread.new` uses fibers (cooperative, single-threaded) |
| System commands from Ruby | No | `system()`, backticks, `Open3` are non-functional |

## Hard Limitations

These are **impossible to work around** in the WASM environment. Do not write lessons that depend on them:

### No Outbound Networking

`Net::HTTP`, `open-uri`, `TCPSocket`, `UDPSocket`, and all socket classes are stubbed. You cannot:
- Call external APIs from Ruby
- Download files from the internet
- Connect to external databases or services

**Workaround for lessons:** If you want to teach API consumption, focus on the controller/model patterns and mock the responses. Show the code structure without executing real HTTP calls.

### No Process Spawning

`system()`, backticks, `exec`, `fork`, and `Open3` are non-functional. The `rails new` generator works because it's been patched, but arbitrary shell commands from tutorial code will not work.

### No Threading

`Thread.new` is shimmed to use `Fiber.new` (cooperative, single-threaded). Code that relies on parallel execution behaves differently. Background job processing and concurrent operations don't work as expected.

### No IO.select

The `poll_oneoff` WASI syscall is unimplemented. This breaks gems like nio4r, Puma, and ActionCable's EventMachine adapter.

### No chmod/fchmod

POSIX permission calls are stubbed. Avoid `FileUtils.chmod` in tutorial code. The `rails new` generator is pre-patched to handle this.

## Gem Compatibility

### Adding Gems

Authors **can add gems** to their tutorial by editing `ruby-wasm/Gemfile` and running `bin/build-wasm` to rebuild the WASM binary. This bakes all gems into the binary at build time.

### Compatibility Tiers

| Tier | Description | Examples |
|------|-------------|---------|
| **Works** | Pure Ruby gems, no native extensions | `devise`, `friendly_id`, `pagy`, `pundit`, `draper`, `kaminari` |
| **Shimmed** | Has native extensions but already patched | `nokogiri` (stub), `io-console` (stub), `bcrypt` |
| **Needs testing** | May work if extension compiles for WASM | Test with `bin/build-wasm` |
| **Won't work** | Requires unsupported syscalls or networking | `pg` (native), `mysql2`, `redis`, `sidekiq`, `puma` |

### Pre-Shimmed Gems

These gems are already handled by the WASM runtime:

| Gem | Behavior |
|-----|----------|
| `nokogiri` | 165-line minimal stub; CSS selectors return `[]`; sufficient for sanitization but not real HTML parsing |
| `io-console` | Stubbed; `winsize` returns `[80, 24]`; `raw` yields without change |
| `nio4r` | `.so` stripped; loads as empty shim |
| `date`, `psych`, `bigdecimal` | `.so` stripped; Ruby falls back to pure-Ruby stdlib |
| `sqlite3` (native) | Replaced by PGLite adapter |

### Gem Build Workflow

```bash
# 1. Edit the Gemfile
vim ruby-wasm/Gemfile

# 2. Rebuild the WASM binary (takes several minutes)
bin/build-wasm

# 3. Test your tutorial locally
npm run dev
```

## Database: PGLite

The database is **PGLite** — an in-browser PostgreSQL implementation compiled to WASM.

### What Works

- Standard ActiveRecord operations: `create`, `find`, `where`, `update`, `destroy`
- Migrations: `rails db:migrate`, `rails db:rollback`
- Seeds: `rails db:seed`
- PostgreSQL-compatible SQL syntax
- Multiple databases (development, test)
- Associations, joins, aggregations
- Indexes and constraints

### What to Know

| Behavior | Detail |
|----------|--------|
| **Data does not survive page reloads** | WebContainer filesystem is in-memory; refreshing the browser resets everything |
| **Database adapter** | `pglite` (auto-configured by wasmify-rails; authors don't need to set this up) |
| **Setup command** | `node scripts/rails.js db:prepare` in `prepareCommands` |
| **Location** | `pgdata/<dbname>/` in WebContainer filesystem |
| **Performance** | Slower than native PostgreSQL; acceptable for tutorial-sized datasets |

### Lesson Design Implications

- Always include `['node scripts/rails.js db:prepare', 'Prepare development database']` in `prepareCommands` for lessons that use the database
- Provide seeds in templates so users start with data
- Don't rely on data from a previous lesson persisting — each lesson should set up its own state via migrations + seeds

## Boot Timing

The WASM runtime takes time to load. Set expectations for tutorial users:

| Phase | Typical Duration | What Happens |
|-------|-----------------|--------------|
| `npm install` | 10-30s | Downloads ~80MB WASM binary + dependencies |
| WASM compile | 2-5s | Browser compiles the binary |
| Rails bootstrap | 2-5s | Loads Rails framework from embedded VFS |
| Command execution | Varies | User's command runs |

**Total first-load time: 15-40 seconds** depending on network and browser.

### Author Tips for Boot Experience

- Include a note in early lessons: "The Ruby runtime takes a moment to load — this is normal!"
- Use `prepareCommands` with descriptive labels so users see progress
- The `['output', 'Setup Logs']` terminal panel shows boot details
- Subsequent lesson navigation is faster if the WebContainer is already booted

## Auto-Authentication

The runtime includes an auto-login patch: if `tmp/authenticated-user.txt` exists in the Rails app root (containing a user identifier), the first request auto-authenticates that user.

This is useful for lessons that teach features behind authentication without requiring the user to manually log in each time.

## Filesystem Boundaries

Ruby code can only access `/workspace` (the WASI preopen). Attempting to access paths outside this boundary raises `Errno::ENOENT`. Tutorial code should never navigate above `/workspace` with `Dir.chdir("..")` or absolute paths outside the preopen.
