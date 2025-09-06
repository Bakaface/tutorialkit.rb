## 0.0.1 "@tutorialkit/runtime" (2025-09-06)


### Bug Fixes

* esm uses .js for relative imports ([#19](https://github.com/Bakaface/tutorialkit.rb/issues/19)) ([b8ad686](https://github.com/Bakaface/tutorialkit.rb/commit/b8ad68646e5afe11c1f65d5a11f8b7304f0f3ac1))
* hydration error after runtime refactor ([#63](https://github.com/Bakaface/tutorialkit.rb/issues/63)) ([8f90338](https://github.com/Bakaface/tutorialkit.rb/commit/8f9033816cd122be49ade2b85e0040469ed9fb1c))
* mobile fixes and basic i18n support ([#127](https://github.com/Bakaface/tutorialkit.rb/issues/127)) ([f85e8eb](https://github.com/Bakaface/tutorialkit.rb/commit/f85e8eb6058473b0ad2e061d39e14d111f3f34fe))
* prevent overwriting template files via `<FileTree>` ([#336](https://github.com/Bakaface/tutorialkit.rb/issues/336)) ([23ed41c](https://github.com/Bakaface/tutorialkit.rb/commit/23ed41c827073a205a2ceaa78973a9200a84c72d))
* problem with creating lessons without solution files ([#108](https://github.com/Bakaface/tutorialkit.rb/issues/108)) ([2d51ff7](https://github.com/Bakaface/tutorialkit.rb/commit/2d51ff713688e34cf3e6140ff4ac4df2a574f6a4))
* **react:** stale lesson data after navigation ([#318](https://github.com/Bakaface/tutorialkit.rb/issues/318)) ([2b5fc92](https://github.com/Bakaface/tutorialkit.rb/commit/2b5fc92fe962fee63b4d2f2efcce04602157268b))
* send lesson updates as a single mount and preview fixes ([#32](https://github.com/Bakaface/tutorialkit.rb/issues/32)) ([272e4a3](https://github.com/Bakaface/tutorialkit.rb/commit/272e4a3171735334347dd8144913fd952c3e9ff5))
* solve shows lesson-only files empty ([#168](https://github.com/Bakaface/tutorialkit.rb/issues/168)) ([bbb13f7](https://github.com/Bakaface/tutorialkit.rb/commit/bbb13f7251a5259a3f7b4fc8300d0b308828bd73))
* support a base different from / in astro config ([#92](https://github.com/Bakaface/tutorialkit.rb/issues/92)) ([3e7830b](https://github.com/Bakaface/tutorialkit.rb/commit/3e7830be7ed1fda9598c569eaad9878aa9d10156))
* **terminal:** change behaviour of terminal configuration ([#44](https://github.com/Bakaface/tutorialkit.rb/issues/44)) ([2cd9fec](https://github.com/Bakaface/tutorialkit.rb/commit/2cd9fecacae10f473f9c000375861e2f59539d41))
* **tutorial-runner:** do not print empty new line for non-runnable command ([#23](https://github.com/Bakaface/tutorialkit.rb/issues/23)) ([c3a6cee](https://github.com/Bakaface/tutorialkit.rb/commit/c3a6cee15cff928eb91798a401b284931e6f6671))


### Features

* add 'Open in StackBlitz'-button ([#219](https://github.com/Bakaface/tutorialkit.rb/issues/219)) ([af428c8](https://github.com/Bakaface/tutorialkit.rb/commit/af428c84f0cd817debd336dc43e88c19583800ce))
* add `@tutorialkit/theme` package to use the theme without astro ([#105](https://github.com/Bakaface/tutorialkit.rb/issues/105)) ([9805996](https://github.com/Bakaface/tutorialkit.rb/commit/9805996a4211a1c8a3e1bfbbd958a27f1957d4d7))
* add eslint ([#90](https://github.com/Bakaface/tutorialkit.rb/issues/90)) ([fcfb3e8](https://github.com/Bakaface/tutorialkit.rb/commit/fcfb3e8109b5be1ef59ac2bfd8efd4db8e635e34))
* add files via file tree ([#314](https://github.com/Bakaface/tutorialkit.rb/issues/314)) ([7782bdc](https://github.com/Bakaface/tutorialkit.rb/commit/7782bdc6e7da0429061c881ac2f95829f149a907))
* add initial adjustments for packages ([c2a64f2](https://github.com/Bakaface/tutorialkit.rb/commit/c2a64f25e4a842bfa9bf4a3c7b2a56a46c22aaf7))
* **astro:** add "Download lesson as zip" button ([#415](https://github.com/Bakaface/tutorialkit.rb/issues/415)) ([9c6e534](https://github.com/Bakaface/tutorialkit.rb/commit/9c6e5349b6ab7e7399437839f6fc4cf11bd6c5c3))
* folder rework, introduce `@tutorialkit/components-react` ([#17](https://github.com/Bakaface/tutorialkit.rb/issues/17)) ([dd74c49](https://github.com/Bakaface/tutorialkit.rb/commit/dd74c49ec4f021ac53fd320cf5023275fbf12311))
* hot reload for files in webcontainer ([#61](https://github.com/Bakaface/tutorialkit.rb/issues/61)) ([949fcf3](https://github.com/Bakaface/tutorialkit.rb/commit/949fcf3438e3bf17902d753089372fbc03911136))
* mobile support ([#91](https://github.com/Bakaface/tutorialkit.rb/issues/91)) ([030ca1e](https://github.com/Bakaface/tutorialkit.rb/commit/030ca1ee688f75f6e59ae25a1b2433823ade384f))
* **previews:** allow hiding the previews entirely ([#41](https://github.com/Bakaface/tutorialkit.rb/issues/41)) ([84ecef5](https://github.com/Bakaface/tutorialkit.rb/commit/84ecef5aecacba37873977fbb19ef64d65d10c14))
* **react:** add button to reload a preview ([#305](https://github.com/Bakaface/tutorialkit.rb/issues/305)) ([d14c404](https://github.com/Bakaface/tutorialkit.rb/commit/d14c4045ad692a45b5b388bb4cfcca9762e6142c))
* **runtime:** `fs.watch` to support syncing new files from webcontainer ([#394](https://github.com/Bakaface/tutorialkit.rb/issues/394)) ([3beda90](https://github.com/Bakaface/tutorialkit.rb/commit/3beda905df20ed9c7d286fc02007cf5b2e74835a))
* **runtime:** add `preview.pathname` ([#233](https://github.com/Bakaface/tutorialkit.rb/issues/233)) ([9bf2156](https://github.com/Bakaface/tutorialkit.rb/commit/9bf2156df26656427482645d3d134127863de233))
* **runtime:** add `terminal.input` for writing to stdin ([#350](https://github.com/Bakaface/tutorialkit.rb/issues/350)) ([c0b8f41](https://github.com/Bakaface/tutorialkit.rb/commit/c0b8f41a28259cc19d7049be2506a5b246d6f32d))
* **runtime:** option for setting terminal open by default ([#246](https://github.com/Bakaface/tutorialkit.rb/issues/246)) ([5419038](https://github.com/Bakaface/tutorialkit.rb/commit/5419038d1c0a6f80da4d9f31e330d0dc0e41def8))
* setup initial template ([37c95ef](https://github.com/Bakaface/tutorialkit.rb/commit/37c95ef472ef6b7b17d0c0f755d0876146d66a3f))
* **store:** fix current document and add onDocumentChanged ([#74](https://github.com/Bakaface/tutorialkit.rb/issues/74)) ([05b1688](https://github.com/Bakaface/tutorialkit.rb/commit/05b1688718ab6e8d7d55c09e892c7f1faef9116e))
* support glob patterns in `editor.fileTree.allowEdits` ([#332](https://github.com/Bakaface/tutorialkit.rb/issues/332)) ([c1a59f5](https://github.com/Bakaface/tutorialkit.rb/commit/c1a59f54c5b5700b8ec8ed5a4a3ebf2169b2409c))
* sync files from WebContainer to editor ([#334](https://github.com/Bakaface/tutorialkit.rb/issues/334)) ([5c1de69](https://github.com/Bakaface/tutorialkit.rb/commit/5c1de69c0e4e233a25a2f9b70fbb1f6c93f12356))
* **terminal:** add support for redirects and allow specific commands ([#76](https://github.com/Bakaface/tutorialkit.rb/issues/76)) ([eca5f22](https://github.com/Bakaface/tutorialkit.rb/commit/eca5f22e3120c4d59349f416322b990d37cb0c15))
* **terminal:** add support for terminals ([#33](https://github.com/Bakaface/tutorialkit.rb/issues/33)) ([53c902b](https://github.com/Bakaface/tutorialkit.rb/commit/53c902bcdc30f3c39f9b2a737e6da1dabd09dabf))
* **terminal:** support linking terminals between lessons ([#36](https://github.com/Bakaface/tutorialkit.rb/issues/36)) ([f4237b7](https://github.com/Bakaface/tutorialkit.rb/commit/f4237b7401cb7709e4546f11465420bf5aff8f2d))



## [1.5.2](https://github.com/stackblitz/tutorialkit/compare/1.5.0...1.5.2) "@tutorialkit/runtime" (2025-06-17)



## [1.5.1](https://github.com/stackblitz/tutorialkit/compare/1.5.0...1.5.1) "@tutorialkit/runtime" (2025-06-17)



# [1.5.0](https://github.com/stackblitz/tutorialkit/compare/1.4.0...1.5.0) "@tutorialkit/runtime" (2025-04-16)



# [1.4.0](https://github.com/stackblitz/tutorialkit/compare/1.3.1...1.4.0) "@tutorialkit/runtime" (2025-03-31)



## [1.3.1](https://github.com/stackblitz/tutorialkit/compare/1.3.0...1.3.1) "@tutorialkit/runtime" (2024-11-25)



# [1.3.0](https://github.com/stackblitz/tutorialkit/compare/1.2.2...1.3.0) "@tutorialkit/runtime" (2024-11-15)


### Features

* **astro:** add "Download lesson as zip" button ([#415](https://github.com/stackblitz/tutorialkit/issues/415)) ([9c6e534](https://github.com/stackblitz/tutorialkit/commit/9c6e5349b6ab7e7399437839f6fc4cf11bd6c5c3))



## [1.2.2](https://github.com/stackblitz/tutorialkit/compare/1.2.1...1.2.2) "@tutorialkit/runtime" (2024-11-12)



## [1.2.1](https://github.com/stackblitz/tutorialkit/compare/1.2.0...1.2.1) "@tutorialkit/runtime" (2024-11-05)



# [1.2.0](https://github.com/stackblitz/tutorialkit/compare/1.1.1...1.2.0) "@tutorialkit/runtime" (2024-11-05)


### Features

* **runtime:** `fs.watch` to support syncing new files from webcontainer ([#394](https://github.com/stackblitz/tutorialkit/issues/394)) ([3beda90](https://github.com/stackblitz/tutorialkit/commit/3beda905df20ed9c7d286fc02007cf5b2e74835a))



## [1.1.1](https://github.com/stackblitz/tutorialkit/compare/1.1.0...1.1.1) "@tutorialkit/runtime" (2024-10-20)



# [1.1.0](https://github.com/stackblitz/tutorialkit/compare/1.0.0...1.1.0) "@tutorialkit/runtime" (2024-10-18)



# [1.0.0](https://github.com/stackblitz/tutorialkit/compare/0.2.3...1.0.0) "@tutorialkit/runtime" (2024-10-01)


### Bug Fixes

* prevent overwriting template files via `<FileTree>` ([#336](https://github.com/stackblitz/tutorialkit/issues/336)) ([23ed41c](https://github.com/stackblitz/tutorialkit/commit/23ed41c827073a205a2ceaa78973a9200a84c72d))


### Features

* add files via file tree ([#314](https://github.com/stackblitz/tutorialkit/issues/314)) ([7782bdc](https://github.com/stackblitz/tutorialkit/commit/7782bdc6e7da0429061c881ac2f95829f149a907))
* **runtime:** add `terminal.input` for writing to stdin ([#350](https://github.com/stackblitz/tutorialkit/issues/350)) ([c0b8f41](https://github.com/stackblitz/tutorialkit/commit/c0b8f41a28259cc19d7049be2506a5b246d6f32d))
* support glob patterns in `editor.fileTree.allowEdits` ([#332](https://github.com/stackblitz/tutorialkit/issues/332)) ([c1a59f5](https://github.com/stackblitz/tutorialkit/commit/c1a59f54c5b5700b8ec8ed5a4a3ebf2169b2409c))
* sync files from WebContainer to editor ([#334](https://github.com/stackblitz/tutorialkit/issues/334)) ([5c1de69](https://github.com/stackblitz/tutorialkit/commit/5c1de69c0e4e233a25a2f9b70fbb1f6c93f12356))



## [0.2.3](https://github.com/stackblitz/tutorialkit/compare/0.2.2...0.2.3) "@tutorialkit/runtime" (2024-09-10)


### Bug Fixes

* **react:** stale lesson data after navigation ([#318](https://github.com/stackblitz/tutorialkit/issues/318)) ([2b5fc92](https://github.com/stackblitz/tutorialkit/commit/2b5fc92fe962fee63b4d2f2efcce04602157268b))



## [0.2.2](https://github.com/stackblitz/tutorialkit/compare/0.2.1...0.2.2) "@tutorialkit/runtime" (2024-09-04)


### Features

* **react:** add button to reload a preview ([#305](https://github.com/stackblitz/tutorialkit/issues/305)) ([d14c404](https://github.com/stackblitz/tutorialkit/commit/d14c4045ad692a45b5b388bb4cfcca9762e6142c))



## [0.2.1](https://github.com/stackblitz/tutorialkit/compare/0.2.0...0.2.1) "@tutorialkit/runtime" (2024-08-30)



# [0.2.0](https://github.com/stackblitz/tutorialkit/compare/0.1.6...0.2.0) "@tutorialkit/runtime" (2024-08-28)



## [0.1.6](https://github.com/stackblitz/tutorialkit/compare/0.1.5...0.1.6) "@tutorialkit/runtime" (2024-08-26)


### Features

* **runtime:** option for setting terminal open by default ([#246](https://github.com/stackblitz/tutorialkit/issues/246)) ([5419038](https://github.com/stackblitz/tutorialkit/commit/5419038d1c0a6f80da4d9f31e330d0dc0e41def8))



## [0.1.5](https://github.com/stackblitz/tutorialkit/compare/0.1.4...0.1.5) "@tutorialkit/runtime" (2024-08-16)


### Features

* **runtime:** add `preview.pathname` ([#233](https://github.com/stackblitz/tutorialkit/issues/233)) ([9bf2156](https://github.com/stackblitz/tutorialkit/commit/9bf2156df26656427482645d3d134127863de233))



## [0.1.4](https://github.com/stackblitz/tutorialkit/compare/0.1.3...0.1.4) "@tutorialkit/runtime" (2024-08-08)



## [0.1.3](https://github.com/stackblitz/tutorialkit/compare/0.1.2...0.1.3) "@tutorialkit/runtime" (2024-08-07)


### Features

* add 'Open in StackBlitz'-button ([#219](https://github.com/stackblitz/tutorialkit/issues/219)) ([af428c8](https://github.com/stackblitz/tutorialkit/commit/af428c84f0cd817debd336dc43e88c19583800ce))



## [0.1.2](https://github.com/stackblitz/tutorialkit/compare/0.1.1...0.1.2) "@tutorialkit/runtime" (2024-08-01)



## [0.1.1](https://github.com/stackblitz/tutorialkit/compare/0.1.0...0.1.1) "@tutorialkit/runtime" (2024-07-30)



# [0.1.0](https://github.com/stackblitz/tutorialkit/compare/0.0.3...0.1.0) "@tutorialkit/runtime" (2024-07-25)


### Bug Fixes

* solve shows lesson-only files empty ([#168](https://github.com/stackblitz/tutorialkit/issues/168)) ([bbb13f7](https://github.com/stackblitz/tutorialkit/commit/bbb13f7251a5259a3f7b4fc8300d0b308828bd73))



## [0.0.3](https://github.com/stackblitz/tutorialkit/compare/0.0.2...0.0.3) "@tutorialkit/runtime" (2024-07-23)



## [0.0.2](https://github.com/stackblitz/tutorialkit/compare/0.0.1...0.0.2) "@tutorialkit/runtime" (2024-07-17)



## [0.0.1](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.26...0.0.1) "@tutorialkit/runtime" (2024-07-17)



## [0.0.1-alpha.26](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.25...0.0.1-alpha.26) "@tutorialkit/runtime" (2024-07-15)


### Bug Fixes

* mobile fixes and basic i18n support ([#127](https://github.com/stackblitz/tutorialkit/issues/127)) ([f85e8eb](https://github.com/stackblitz/tutorialkit/commit/f85e8eb6058473b0ad2e061d39e14d111f3f34fe))



## [0.0.1-alpha.25](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.24...0.0.1-alpha.25) "@tutorialkit/runtime" (2024-07-09)



## [0.0.1-alpha.24](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.23...0.0.1-alpha.24) "@tutorialkit/runtime" (2024-07-04)


### Bug Fixes

* problem with creating lessons without solution files ([#108](https://github.com/stackblitz/tutorialkit/issues/108)) ([2d51ff7](https://github.com/stackblitz/tutorialkit/commit/2d51ff713688e34cf3e6140ff4ac4df2a574f6a4))
* support a base different from / in astro config ([#92](https://github.com/stackblitz/tutorialkit/issues/92)) ([3e7830b](https://github.com/stackblitz/tutorialkit/commit/3e7830be7ed1fda9598c569eaad9878aa9d10156))


### Features

* add `@tutorialkit/theme` package to use the theme without astro ([#105](https://github.com/stackblitz/tutorialkit/issues/105)) ([9805996](https://github.com/stackblitz/tutorialkit/commit/9805996a4211a1c8a3e1bfbbd958a27f1957d4d7))
* add eslint ([#90](https://github.com/stackblitz/tutorialkit/issues/90)) ([fcfb3e8](https://github.com/stackblitz/tutorialkit/commit/fcfb3e8109b5be1ef59ac2bfd8efd4db8e635e34))
* mobile support ([#91](https://github.com/stackblitz/tutorialkit/issues/91)) ([030ca1e](https://github.com/stackblitz/tutorialkit/commit/030ca1ee688f75f6e59ae25a1b2433823ade384f))
* **terminal:** add support for redirects and allow specific commands ([#76](https://github.com/stackblitz/tutorialkit/issues/76)) ([eca5f22](https://github.com/stackblitz/tutorialkit/commit/eca5f22e3120c4d59349f416322b990d37cb0c15))



## [0.0.1-alpha.23](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.22...0.0.1-alpha.23) "@tutorialkit/runtime" (2024-06-19)


### Bug Fixes

* hydration error after runtime refactor ([#63](https://github.com/stackblitz/tutorialkit/issues/63)) ([8f90338](https://github.com/stackblitz/tutorialkit/commit/8f9033816cd122be49ade2b85e0040469ed9fb1c))


### Features

* hot reload for files in webcontainer ([#61](https://github.com/stackblitz/tutorialkit/issues/61)) ([949fcf3](https://github.com/stackblitz/tutorialkit/commit/949fcf3438e3bf17902d753089372fbc03911136))
* **store:** fix current document and add onDocumentChanged ([#74](https://github.com/stackblitz/tutorialkit/issues/74)) ([05b1688](https://github.com/stackblitz/tutorialkit/commit/05b1688718ab6e8d7d55c09e892c7f1faef9116e))



