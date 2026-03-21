---
type: tutorial
openInStackBlitz: false
meta:
  image: /cover.png
  title: My Rails Tutorial
  description: An interactive Ruby on Rails tutorial powered by WebAssembly
prepareCommands:
  - ['npm install', 'Preparing Ruby runtime']
terminalBlockingPrepareCommandsCount: 1
previews: false
filesystem:
  watch: ['/*.json', '/workspace/**/*']
terminal:
  open: true
  activePanel: 0
  panels:
    - type: terminal
      id: 'cmds'
      title: 'Command Line'
      allowRedirects: true
    - ['output', 'Setup Logs']
---
