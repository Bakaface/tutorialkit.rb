---
name: tutorial-lesson-config
description: |
  Use this skill whenever configuring lesson frontmatter options or understanding the
  configuration cascade. Trigger when the user says 'frontmatter', 'prepareCommands',
  'mainCommand', 'editor config', 'terminal config', 'preview config', 'lesson configuration',
  'configuration inheritance', 'focus file', 'file tree scope', 'i18n', 'allowEdits',
  'allowCommands', 'previews', 'autoReload', 'downloadAsZip', 'scope', or asks about any
  YAML frontmatter option for a lesson — even if they don't explicitly mention configuration.
  This is the authoritative reference for all TutorialKit frontmatter options with
  Rails-specific defaults. Documents the configuration cascade, all editor/terminal/preview/
  command options, all 18 i18n keys, and Rails-specific features like custom.shell.workdir.
  Do NOT guess frontmatter options without this skill. Do NOT use for content hierarchy
  (use tutorial-content-structure) or file/template organization (use rails-file-management).
---

# Tutorial Lesson Configuration

Complete reference for configuring lessons, with Rails-specific defaults and patterns.

## Configuration Cascade

Configuration **inherits downward**: Tutorial > Part > Chapter > Lesson. Set shared defaults at the tutorial level; override per-lesson as needed.

```
meta.md (type: tutorial)     ← base defaults for all lessons
  meta.md (type: part)       ← overrides for this part's lessons
    meta.md (type: chapter)  ← overrides for this chapter's lessons
      content.md (type: lesson) ← final per-lesson overrides
```

**Rails convention:** Set these once in the tutorial root `meta.md`:

```yaml
prepareCommands:
  - ['npm install', 'Preparing Ruby runtime']
terminalBlockingPrepareCommandsCount: 1
previews: false
filesystem:
  watch: ['/*.json', '/workspace/**/*']
terminal:
  open: true
  panels:
    - type: terminal
      id: 'cmds'
      title: 'Command Line'
      allowRedirects: true
    - ['output', 'Setup Logs']
```

Then override only what changes per-lesson (e.g., enable `previews: [3000]` for lessons with a running server).

## Editor Configuration

### Show/Hide Editor

```yaml
editor: false           # Hide editor entirely (terminal-only lessons)
editor: true            # Show editor (default)
```

### File Tree Options

```yaml
editor:
  fileTree: false                      # Hide file tree, show only editor tabs
  fileTree:
    allowEdits: true                   # Allow creating files/folders anywhere
    allowEdits: "/workspace/**"        # Allow edits matching glob
    allowEdits:                        # Multiple glob patterns
      - "/workspace/store/app/**"
      - "/workspace/store/config/**"
```

### Focus File

Auto-open a specific file in the editor when the lesson loads:

```yaml
focus: /workspace/store/app/controllers/products_controller.rb
```

**Path must be absolute** from the WebContainer root. For Rails apps, this is typically `/workspace/<app-name>/...`.

### File Tree Scope and Root

```yaml
scope: /workspace/store        # Only show files under this path in the tree
hideRoot: true                 # Hide the "/" root node (default: true)
```

`scope` is useful to avoid exposing infrastructure files (`bin/`, `lib/`, `scripts/`) to tutorial users.

## Terminal Configuration

### Basic

```yaml
terminal: false     # Hide terminal entirely
terminal: true      # Show with defaults
```

### Panel Configuration

```yaml
terminal:
  open: true              # Open terminal panel by default
  activePanel: 0          # Which tab is active (0-indexed)
  panels:
    - type: terminal      # Interactive terminal
      id: 'cmds'          # Persistent session ID (survives lesson navigation)
      title: 'Command Line'
      allowRedirects: true
      allowCommands:       # Restrict allowed commands (optional)
        - rails
        - ruby
        - node
    - type: output         # Read-only output panel (max 1 per lesson)
      title: 'Setup Logs'
```

**Shorthand panel syntax:**

```yaml
panels:
  - terminal                    # Interactive terminal, default title
  - output                     # Read-only output, default title
  - [terminal, "Rails Console"] # Interactive with custom title
  - ['output', 'Setup Logs']   # Read-only with custom title
```

**Persistent sessions:** Use `id` to keep terminal state across lesson navigation. The user's terminal history and running processes persist when they switch between lessons that share the same `id`.

### Output Panel

Only **one** `output` panel is allowed per lesson. It captures output from `prepareCommands` and `mainCommand`.

## Preview Configuration

### Basic

```yaml
previews: false          # No preview panel
previews: true           # Auto-detect preview
previews: [3000]         # Show preview for port 3000
```

### Advanced

```yaml
previews:
  - 3000                                          # Port only
  - "3000/products"                               # Port with pathname
  - [3000, "Rails App"]                           # Port with title
  - [3000, "Rails App", "/products"]              # Port, title, pathname
  - { port: 3000, title: "App", pathname: "/products" }  # Object form
```

### Auto-Reload

```yaml
autoReload: true    # Force preview reload when navigating to this lesson
```

Useful for lessons where the preview state may be stale from a previous lesson.

## Commands

### prepareCommands

Commands that run **before** the lesson is interactive. Shown as progress steps to the user:

```yaml
prepareCommands:
  - 'npm install'                                              # String form
  - ['npm install', 'Preparing Ruby runtime']                  # [command, label]
  - { command: 'node scripts/rails.js db:prepare', title: 'Preparing database' }  # Object form
```

**Rails patterns:**

```yaml
# Basic — just install WASM runtime (set at tutorial level)
prepareCommands:
  - ['npm install', 'Preparing Ruby runtime']

# With database — for lessons that need migrations/seeds
prepareCommands:
  - ['npm install', 'Preparing Ruby runtime']
  - ['node scripts/rails.js db:prepare', 'Prepare development database']
```

### terminalBlockingPrepareCommandsCount

How many `prepareCommands` must finish before the terminal becomes interactive:

```yaml
terminalBlockingPrepareCommandsCount: 1   # Block until npm install finishes
```

### mainCommand

The primary long-running process (usually the dev server). Runs after all `prepareCommands` complete:

```yaml
mainCommand: ['node scripts/rails.js server', 'Starting Rails server']
```

**Important:** Use `node scripts/rails.js server` — not `rails server` — because the Rails CLI dispatches through Node.js wrapper scripts in this WASM environment.

## Filesystem Watching

```yaml
filesystem:
  watch: true                            # Watch all files
  watch: ['/*.json', '/workspace/**/*']  # Watch specific patterns
```

For Rails tutorials, watch `/workspace/**/*` so the preview reflects file changes in the Rails app.

## Other Options

### Custom Shell Working Directory

```yaml
custom:
  shell:
    workdir: "/workspace/store"
```

Sets the terminal's working directory by sending `cd /home/tutorial<workdir>` to the shell on lesson load. This is a **Rails-tutorial-specific** feature (implemented via `ShellConfigurator` in this template, not upstream TutorialKit). Essential for Rails tutorials where the app lives at `/workspace/<app-name>`.

### Template Selection

```yaml
template: default          # Use the default (base Rails) template
template: rails-app        # Use a template with pre-generated Rails app
```

Templates live in `src/templates/`. Each lesson can also override via `_files/.tk-config.json`.

### Download and StackBlitz

```yaml
openInStackBlitz: false       # Hide "Open in StackBlitz" button (default: true)
openInStackBlitz:             # Object form with project customization
  projectTitle: "My Rails Tutorial"
  projectDescription: "A Rails CRUD app"
  projectTemplate: "node"     # html | node | angular-cli | create-react-app | javascript | polymer | typescript | vue
downloadAsZip: true           # Allow downloading lesson code (default: false)
downloadAsZip:
  filename: "rails-crud-app"  # Custom zip filename
```

### Edit Page Link

```yaml
editPageLink: "https://github.com/your-org/your-tutorial/edit/main/src/content/tutorial/${path}"
```

### Meta Tags

```yaml
meta:
  title: "Learn Rails CRUD Operations"
  description: "Build a product catalog with full CRUD in Ruby on Rails"
  image: "/og-image.png"
```

## i18n — Customize UI Text

Override any UI label at any level in the cascade:

```yaml
i18n:
  solveButtonText: "Show Answer"
  resetButtonText: "Start Over"
  prepareEnvironmentTitleText: "Setting Up Rails"
  toggleTerminalButtonText: "Terminal"
  defaultPreviewTitleText: "Rails App"
  startWebContainerText: "Launch Tutorial"
```

All available keys:

| Key | Default |
|-----|---------|
| `partTemplate` | `"Part ${index}: ${title}"` |
| `editPageText` | `"Edit this page"` |
| `webcontainerLinkText` | `"Powered by WebContainers"` |
| `startWebContainerText` | `"Run this tutorial"` |
| `noPreviewNorStepsText` | `"No preview to run nor steps to show"` |
| `filesTitleText` | `"Files"` |
| `fileTreeCreateFileText` | `"Create file"` |
| `fileTreeCreateFolderText` | `"Create folder"` |
| `fileTreeActionNotAllowedText` | `"This action is not allowed"` |
| `fileTreeFileExistsAlreadyText` | `"File exists on filesystem already"` |
| `fileTreeAllowedPatternsText` | `"Created files and folders must match following patterns:"` |
| `confirmationText` | `"OK"` |
| `prepareEnvironmentTitleText` | `"Preparing Environment"` |
| `defaultPreviewTitleText` | `"Preview"` |
| `reloadPreviewTitle` | `"Reload Preview"` |
| `toggleTerminalButtonText` | `"Toggle Terminal"` |
| `solveButtonText` | `"Solve"` |
| `resetButtonText` | `"Reset"` |
