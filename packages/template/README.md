# TutorialKit Starter

👋 Welcome to TutorialKit!

This README includes everything you need to start writing your tutorial content quickly.

## Project Structure

```bash
.
├── astro.config.mjs    # TutorialKit uses Astro 🚀 (https://astro.build)
├── src │   ├── ...
│   ├── content
│   │   └── tutorial    # Your tutorial content lives here
│   └── templates       # Your templates (see below for more information)
├── public
│   ├── favicon.svg
│   └── logo.svg        # Default logo used in top left for your tutorial
├── ...
├── theme.ts            # Customize the theme of the tutorial
└── uno.config.ts       # UnoCSS config (https://unocss.dev/)
```

## Getting Started

Make sure you have all dependencies installed and started the dev server:

```bash
<% pkgManager %> install
<% pkgManager %> run dev
```

## Ruby on Rails WebAssembly Support

This TutorialKit template includes support for running Ruby on Rails applications directly in the browser using WebAssembly. This enables you to create interactive Rails tutorials without requiring any server-side infrastructure.

### Setting Up Ruby WASM

1. **Configure Dependencies**: Edit `ruby-wasm/Gemfile` to add the Ruby gems needed for your tutorial
2. **Build WASM Module**: Pack your gems into the prebuilt Ruby WASM binary (~1-4 min; downloads the base binary on first run):
   ```bash
   <% pkgManager %> run pack:wasm
   ```
   Host prerequisites: Ruby 3.3.x with RubyGems >= 3.6 and < 4 (`gem update --system 3.6.9`), a Rust toolchain, and the `gh` CLI. The script checks these and tells you what to fix. (`<% pkgManager %> run build:wasm` is the slow legacy full rebuild.)
3. **Start Development**: Run the dev server as usual:
   ```bash
   <% pkgManager %> run dev
   ```

### How It Works

The Ruby WASM build pipeline (`ruby-wasm/` directory):
- Compiles the Ruby interpreter to WebAssembly
- Bundles Rails framework and all specified gems
- Creates a self-contained WASM module that runs entirely in the browser
- Integrates seamlessly with WebContainers for file system and terminal operations

### Features

- **Full Rails Environment**: Run complete Rails applications client-side
- **Interactive Terminal**: Execute Rails commands (rails new, generate, migrate, etc.)
- **Live Code Editing**: Edit Ruby/Rails code with instant feedback
- **No Backend Required**: Everything runs in the user's browser

## UI Structure

```markdown
┌─────────────────────────────────────────────────────┐
│ ● ● ●                                               │
├───────────────────────────┬─────────────────────────┤
│                           │                         │
│                           │                         │
│                           │                         │
│                           │                         │
│                           │       Code Editor       │
│                           │                         │
│                           │                         │
│                           │                         │
│                           │                         │
│          Content          ├─────────────────────────┤
│                           │                         │
│                           │                         │
│                           │  Preview & Boot Screen  │
│                           │                         │
│                           │                         │
│                           ├─────────────────────────┤
│                           │                         │
│                           │        Terminal         │
│                           │                         │
└───────────────────────────┴─────────────────────────┘
```

## Authoring Content

A tutorial consists of parts, chapters, and lessons. For example:

- Part 1: Basics of Vite
  - Chapter 1: Introduction
    - Lesson 1: Welcome!
    - Lesson 2: Why Vite?
    - …
  - Chapter 2: Your first Vite project
- Part 2: CLI
  - …

Your content is organized into lessons, with chapters and parts providing a structure and defining common metadata for these lessons.

Here’s an example of how it would look like in `src/content/tutorial`:

```bash
tutorial
├── 1-basics-of-vite
│   ├── 1-introduction
│   │   ├── 1-welcome
│   │   │   ├── content.md    # The content of your lesson
│   │   │   ├── _files        # Initial set of files
│   │   │   │   └── ...
│   │   │   └── _solution     # Solution of the lesson
│   │   │       └── ...
│   │   ├── 2-why-vite
│   │   │   ├── content.md
│   │   │   └── _files
│   │   │       └── ...
│   │   └── meta.md           # Metadata for the chapter
│   └── meta.md               # Metadata for the part
├── 2-advanced
│   ├── ...
│   └── meta.md
└── meta.md                   # Metadata for the tutorial
```

### Supported Content Formats

Content can be either written as Markdown (`.md`) files or using [MDX](https://mdxjs.com/) (`.mdx`). Files have a Front Matter at the top that contains the metadata and everything that comes after is the content of your lesson.

**Example**

```markdown
---
type: lesson
title: Welcome!
---

# Welcome to TutorialKit!

In this tutorial we'll walk you through how to setup your environment to
write your first tutorial 🤩
```

The metadata file (`meta.md`) of parts, chapters, and lessons do not contain any content. It only contains the Front Matter for configuration.

### Metadata

Here is an overview of the properties that can be used as part of the Front Matter:

| Property        | Required | Type                        | Inherited | Description                                                                                                                                           |
| --------------- | -------- | --------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | ✅       | `part \| chapter \| lesson` | ❌        | The type of the metadata.                                                                                                                             |
| title           | ✅       | `string`                    | ❌        | The title of the part, chapter, or lesson.                                                                                                            |
| slug            |          | `string`                    | ❌        | Let’s you customize the URL pathname which is `/:partSlug/:chapterSlug/:lessonSlug`.                                                                  |
| previews        |          | `Preview[]`                 | ✅        | Configure which ports should be used for the previews. If not specified, the lowest port will be used.                                                |
| autoReload      |          | `boolean`                   | ✅        | Navigating to a lesson that specifies `autoReload` will always reload the preview. This is typically only needed if your server does not support HMR. |
| prepareCommands |          | `Command[]`                 | ✅        | List of commands to execute sequentially. They are typically used to install dependencies or to run scripts.                                          |
| mainCommand     |          | `Command`                   | ✅        | The main command to be executed. This command will run after the `prepareCommands`.                                                                   |

A `Command` has the following shape:

```ts
string | [command: string, title: string] | { command: string, title: string }
```

The `title` is used as part of the boot screen (see [UI Structure](#ui-structure)).

A `Preview` has the following shape:

```ts
string | [port: number, title: string] | { port: number, title: string }
```

In most cases, metadata is inherited. For example, if you specify a `mainCommand` on a chapter without specifying it on any of its lessons, each lesson will use the `mainCommand` from its respective chapter. This extends to chapter and parts as well.
