<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="media/logo-white.svg">
    <img src="media/logo.svg" alt="tutorialkit-logo" width="440px" height="120px" />
  </picture>
  <br>
  <strong>TutorialKit.rb - Ruby on Rails Edition</strong><br>
  A fork of TutorialKit by <a href="https://stackblitz.com">StackBlitz</a> with added support for Ruby on Rails WebAssembly.<br>
  Create interactive Ruby/Rails tutorials that run entirely in the browser.
</p>

<p align="center">
  <a href="https://tutorialkit.dev/"><strong>Original: tutorialkit.dev</strong></a>
  <br>
</p>

<p align="center">
  <a href="https://tutorialkit.dev/guides/about/#getting-started">Get Started</a>
  ·
  <a href="https://demo.tutorialkit.dev/">Try Demo</a>
  <br>
  <br>
</p>

<hr>

## 🚀 Ruby on Rails WebAssembly Support

This fork extends TutorialKit with the ability to run Ruby on Rails applications directly in the browser using WebAssembly. No server infrastructure required - everything runs client-side!

### Key Features

- **Full Ruby/Rails Environment**: Complete Rails framework running in WebContainers
- **Interactive Development**: Live code editing, terminal access, and instant preview
- **Zero Backend**: All computation happens in the user's browser
- **Educational Focus**: Perfect for creating interactive Rails tutorials and workshops

### Quick Start

```bash
# Create a new TutorialKit.rb project and follow the instructions
npx create-tutorialkit-rb my-rails-tutorial
```

FIXME: for now, you'll need to use `pnpm` as a package manager and edit the generated package.json to resolve the temporary issue with the internal package versioning.
```
{
  // ...
  // Add this section to your package.json
  "pnpm": {
    "overrides": {
      "@tutorialkit-rb/types": "1.5.2-rb.0.1.1",
      "@tutorialkit-rb/theme": "1.5.2-rb.0.1.1",
      "@tutorialkit-rb/react": "1.5.2-rb.0.1.1",
      "@tutorialkit-rb/runtime": "1.5.2-rb.0.1.1",
      "@tutorialkit-rb/astro": "1.5.2-rb.0.1.1"
    }
  }
}
```

<hr>

## Documentation

Read our documentation on [tutorialkit.dev](https://tutorialkit.dev/guides/about)

## Development Setup

### Prerequisites

- Install [Node.js](https://nodejs.org/en) v18.18 or above.
- Install [pnpm](https://pnpm.io/).

### Contribution

See [Contributing Guide](./CONTRIBUTING.md).

## Community

Come and say hi :wave:!

- [X](https://x.com/stackblitz)
- [Discord](https://discord.gg/stackblitz)
- [GitHub](https://github.com/stackblitz)
