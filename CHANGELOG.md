## 0.0.1 (2025-09-06)


### Bug Fixes

* a transition-theme class was missing for the content right border ([#139](https://github.com/Bakaface/tutorialkit.rb/issues/139)) ([c75ef40](https://github.com/Bakaface/tutorialkit.rb/commit/c75ef4089833b8974c2b0877535f1967065ef08a))
* add link to ui-structure ([5f3129c](https://github.com/Bakaface/tutorialkit.rb/commit/5f3129c0e3880434bfac1d5f2aab5bb7b26352d6))
* add missing hiddenFiles as well ([9f2f6e1](https://github.com/Bakaface/tutorialkit.rb/commit/9f2f6e13dbfde5e40b3701043119ab57cb3d423c))
* add the scope as well ([2e3068c](https://github.com/Bakaface/tutorialkit.rb/commit/2e3068c033924ef09cf32cc57f4576f529269df4))
* align `Powered by WebContainers` to the bottom ([#301](https://github.com/Bakaface/tutorialkit.rb/issues/301)) ([98ef05b](https://github.com/Bakaface/tutorialkit.rb/commit/98ef05b828ff8f3ab45a49e62bf1a4b79e65acfc))
* **astro/types:** `webcontainer` should be a `Promise<WebContainer>` ([#259](https://github.com/Bakaface/tutorialkit.rb/issues/259)) ([c7bad20](https://github.com/Bakaface/tutorialkit.rb/commit/c7bad203045b702afda3176cece645bee4d4f6e3))
* **astro:** allow URLs in `meta.image` ([#422](https://github.com/Bakaface/tutorialkit.rb/issues/422)) ([3125547](https://github.com/Bakaface/tutorialkit.rb/commit/3125547c043fe4a76dca95b1eb973362967ccf02))
* **astro:** better default meta tags ([#342](https://github.com/Bakaface/tutorialkit.rb/issues/342)) ([d81d1cc](https://github.com/Bakaface/tutorialkit.rb/commit/d81d1cc01fdbce702ae91a6a5f371bd03c38b338))
* **astro:** correct error message when chapter not found ([#361](https://github.com/Bakaface/tutorialkit.rb/issues/361)) ([0510474](https://github.com/Bakaface/tutorialkit.rb/commit/05104741a73180dbaeb583317cd77df104d2d2c7))
* **astro:** don't modify state during re-renders of `<WorkspacePanelWrapper />` ([#240](https://github.com/Bakaface/tutorialkit.rb/issues/240)) ([745be37](https://github.com/Bakaface/tutorialkit.rb/commit/745be37ef20ae97d6ded221fca24670742981879))
* **astro:** optimize CJS dependency `picomatch` ([#406](https://github.com/Bakaface/tutorialkit.rb/issues/406)) ([17a48a6](https://github.com/Bakaface/tutorialkit.rb/commit/17a48a6858912277942d87b8af28a601adfad8da))
* **astro:** published package missing `@tutorialkit/astro/types` ([#347](https://github.com/Bakaface/tutorialkit.rb/issues/347)) ([f49e910](https://github.com/Bakaface/tutorialkit.rb/commit/f49e9107d35b98079a0fb16c74b9f37a45357661))
* **astro:** sub folders not working on Windows ([#225](https://github.com/Bakaface/tutorialkit.rb/issues/225)) ([694f5ca](https://github.com/Bakaface/tutorialkit.rb/commit/694f5ca26dafae33554136ffbedea70c6c87585c))
* **astro:** types of override components to optional ([#376](https://github.com/Bakaface/tutorialkit.rb/issues/376)) ([0af3848](https://github.com/Bakaface/tutorialkit.rb/commit/0af384889f5a3e7e46ea4803b1b1a631c15d331f))
* **astro:** webcontainers link to be in plural ([#227](https://github.com/Bakaface/tutorialkit.rb/issues/227)) ([0b86ebd](https://github.com/Bakaface/tutorialkit.rb/commit/0b86ebd4e6e2b28dd2ef0ff97a5c66f9eb780973))
* **astro:** work-around for dev-mode's `ReferenceError: __WC_CONFIG__ is not defined` errors ([#293](https://github.com/Bakaface/tutorialkit.rb/issues/293)) ([70fa3e2](https://github.com/Bakaface/tutorialkit.rb/commit/70fa3e2895f2f2c4d25aa3410690297afb49a44b))
* bug fixes for previews ([#42](https://github.com/Bakaface/tutorialkit.rb/issues/42)) ([2324741](https://github.com/Bakaface/tutorialkit.rb/commit/2324741ce067dd8c7d89b4209fa55035488a4676))
* **ci:** override @astrojs/language-server with an older version ([#145](https://github.com/Bakaface/tutorialkit.rb/issues/145)) ([bf9119e](https://github.com/Bakaface/tutorialkit.rb/commit/bf9119ef29913eadd66581a103c3b34d9bf58401))
* **ci:** use PAT to make sure release PRs trigger workflows ([#124](https://github.com/Bakaface/tutorialkit.rb/issues/124)) ([5e1a8bc](https://github.com/Bakaface/tutorialkit.rb/commit/5e1a8bc4a9a569b27da787cfa5459723321b45f7))
* **cli:** `create-tutorial` not depending on `@tutorialkit/cli` package ([#254](https://github.com/Bakaface/tutorialkit.rb/issues/254)) ([3b480db](https://github.com/Bakaface/tutorialkit.rb/commit/3b480dbd682a8c7657151dc93054f8209fdad312))
* **cli:** add name validation ([06fb037](https://github.com/Bakaface/tutorialkit.rb/commit/06fb03703376ba8b896ee4261898c714dae159ed))
* **cli:** fix installing dependencies ([#29](https://github.com/Bakaface/tutorialkit.rb/issues/29)) ([db4080d](https://github.com/Bakaface/tutorialkit.rb/commit/db4080d6536ea2c1f2203772ea5259c830fb314e))
* **cli:** improve enterprise question ([#14](https://github.com/Bakaface/tutorialkit.rb/issues/14)) ([62b0eaa](https://github.com/Bakaface/tutorialkit.rb/commit/62b0eaa107ad6e7cb7c9b09e29c7a5b208a93ec5))
* **cli:** list `eject` command in `--help` ([#373](https://github.com/Bakaface/tutorialkit.rb/issues/373)) ([bc61229](https://github.com/Bakaface/tutorialkit.rb/commit/bc61229f156db3043b57dd3f85f09b72702a70b0))
* **cli:** normalize windows paths for `fast-glob` ([#184](https://github.com/Bakaface/tutorialkit.rb/issues/184)) ([eaa9890](https://github.com/Bakaface/tutorialkit.rb/commit/eaa9890da93169ec2e3249a6065501a1326b4df9))
* **cli:** read ignore file ([86819ef](https://github.com/Bakaface/tutorialkit.rb/commit/86819efdc29c6e777e8f785d4a9beaf409bda28d))
* **cli:** remove enterprise question ([#26](https://github.com/Bakaface/tutorialkit.rb/issues/26)) ([84f1e0a](https://github.com/Bakaface/tutorialkit.rb/commit/84f1e0adb75d19af163168b825958fb357800bdf))
* **cli:** remove title from tutorial meta file ([#86](https://github.com/Bakaface/tutorialkit.rb/issues/86)) ([c2f7688](https://github.com/Bakaface/tutorialkit.rb/commit/c2f7688b27074c6261f025525437bccea9431fd3))
* **cli:** remove vs code `settings.json` ([#173](https://github.com/Bakaface/tutorialkit.rb/issues/173)) ([8dde2c3](https://github.com/Bakaface/tutorialkit.rb/commit/8dde2c3248fe897921c1e928f5084c426270ede2))
* **cli:** use selected package manager in next steps ([3b40b6b](https://github.com/Bakaface/tutorialkit.rb/commit/3b40b6b0f8d0e0a910f85b54adfb1c746493ae3c))
* convert FileTree component from `const Comp` to `function Comp` ([7844a19](https://github.com/Bakaface/tutorialkit.rb/commit/7844a1966e15d59ac8b7e6f862e9b2cb9bf18eae))
* correctly rename `.npmignore` to `.gitignore` and fix binary files bugs ([#8](https://github.com/Bakaface/tutorialkit.rb/issues/8)) ([c6e2593](https://github.com/Bakaface/tutorialkit.rb/commit/c6e2593e95d925d108710041cba12d9d5f0700de))
* css tweaks to have consistent size for sections ([32b9874](https://github.com/Bakaface/tutorialkit.rb/commit/32b9874da7ee059720a09a7ccf9102ad162da46f))
* **deps:** update `astro` for Node 18.18 compatibility ([#159](https://github.com/Bakaface/tutorialkit.rb/issues/159)) ([4b50335](https://github.com/Bakaface/tutorialkit.rb/commit/4b50335d284fd22d38d9dab2c0f85e219533a9e5))
* **dev:** do not optimize components in development ([#28](https://github.com/Bakaface/tutorialkit.rb/issues/28)) ([1aded2a](https://github.com/Bakaface/tutorialkit.rb/commit/1aded2aef21f6821de743260b7efe5d5b788cb5f))
* do not override files when constructing the file system tree ([0a4691c](https://github.com/Bakaface/tutorialkit.rb/commit/0a4691c7ca98a6e9fb037852018334dbbe5796cf))
* do not use client-only for theme toggle ([ee58068](https://github.com/Bakaface/tutorialkit.rb/commit/ee580684fdc744cf414386531fda5c44de9c32ff))
* **docs:** jumping to bottom of getting started page ([#170](https://github.com/Bakaface/tutorialkit.rb/issues/170)) ([55430f9](https://github.com/Bakaface/tutorialkit.rb/commit/55430f9006427e9435e9ce7d1be62315c6575e2b))
* editor bug where the wrong file content is shown ([#16](https://github.com/Bakaface/tutorialkit.rb/issues/16)) ([0caeb16](https://github.com/Bakaface/tutorialkit.rb/commit/0caeb163c59c02cdd8a17a554c51ba1a7abb948c))
* editor ignoring changes ([#102](https://github.com/Bakaface/tutorialkit.rb/issues/102)) ([0f01e31](https://github.com/Bakaface/tutorialkit.rb/commit/0f01e317d449761fb7da8291119e57bd1d934e79))
* esm uses .js for relative imports ([#19](https://github.com/Bakaface/tutorialkit.rb/issues/19)) ([b8ad686](https://github.com/Bakaface/tutorialkit.rb/commit/b8ad68646e5afe11c1f65d5a11f8b7304f0f3ac1))
* **extension:** only match tutorialkit content and meta files ([#242](https://github.com/Bakaface/tutorialkit.rb/issues/242)) ([9c1b55a](https://github.com/Bakaface/tutorialkit.rb/commit/9c1b55abd0967053782458db4ee41180f26d6c5d))
* **extension:** setup CI and minor improvements ([#142](https://github.com/Bakaface/tutorialkit.rb/issues/142)) ([5a1f108](https://github.com/Bakaface/tutorialkit.rb/commit/5a1f1084d018de789eb563c5959f557658963168))
* feature request issue template ([cc8423a](https://github.com/Bakaface/tutorialkit.rb/commit/cc8423abe2c613f82d73179ca82f39e4ac0929c9))
* flicker of file tree on page load ([4caec04](https://github.com/Bakaface/tutorialkit.rb/commit/4caec04a5d9b6c6aabcf6baca841a7476bb93978))
* forgot to push export ([d382fd9](https://github.com/Bakaface/tutorialkit.rb/commit/d382fd961d5c1b8c3ccb37b8f317e94daaf4dc3e))
* generate correct changelogs when doing a PR ([#113](https://github.com/Bakaface/tutorialkit.rb/issues/113)) ([8b8b1ca](https://github.com/Bakaface/tutorialkit.rb/commit/8b8b1caea8793748d9946e163a184a3ecb958358))
* headers not matching the documentation ([#451](https://github.com/Bakaface/tutorialkit.rb/issues/451)) ([8588436](https://github.com/Bakaface/tutorialkit.rb/commit/8588436a611bda02c7dbeec49b32d43f7ac1c8b5))
* hide preview container when `previews: false` ([#412](https://github.com/Bakaface/tutorialkit.rb/issues/412)) ([b35de43](https://github.com/Bakaface/tutorialkit.rb/commit/b35de43d437492d124af232adddd2a30ec70ec0e))
* hide terminal by default ([#30](https://github.com/Bakaface/tutorialkit.rb/issues/30)) ([35be31e](https://github.com/Bakaface/tutorialkit.rb/commit/35be31e3dad0ab83771ce6425cf732b5c77588a7))
* hideRoot only meant to hide / not src/ ([d14c349](https://github.com/Bakaface/tutorialkit.rb/commit/d14c3499eae8235cafb50b5c47fd7c75bd908754))
* hot reloading, ssr exception, and minor formatting ([dee3751](https://github.com/Bakaface/tutorialkit.rb/commit/dee3751381701bea309a3905592f824b75701ae8))
* hydration error after runtime refactor ([#63](https://github.com/Bakaface/tutorialkit.rb/issues/63)) ([8f90338](https://github.com/Bakaface/tutorialkit.rb/commit/8f9033816cd122be49ade2b85e0040469ed9fb1c))
* ignore platform specific files ([#69](https://github.com/Bakaface/tutorialkit.rb/issues/69)) ([186e2db](https://github.com/Bakaface/tutorialkit.rb/commit/186e2dba86b529fcc5816861e689edf128f520e2))
* ignore templates `node_modules` ([#198](https://github.com/Bakaface/tutorialkit.rb/issues/198)) ([d7215ca](https://github.com/Bakaface/tutorialkit.rb/commit/d7215ca2a080267a3cc2c660dc997665d2fcfc26))
* implement hideRoot(s) and change the default to false ([7697a9c](https://github.com/Bakaface/tutorialkit.rb/commit/7697a9c9ecfa67875378c4683c8c489d750ad229))
* issue after merge conflicts as baseSchema should extend from webcontainerSchema ([aa1a758](https://github.com/Bakaface/tutorialkit.rb/commit/aa1a7589b65609368f54e7b5581b7899220dad21))
* issues with file tree ([add7ace](https://github.com/Bakaface/tutorialkit.rb/commit/add7ace175270e208704b8db475bf3209a891343))
* **logo:** support multiple formats and remove styling requirements ([#62](https://github.com/Bakaface/tutorialkit.rb/issues/62)) ([79cb18d](https://github.com/Bakaface/tutorialkit.rb/commit/79cb18dca4e6b80a1f12ec96e1e627678f7b377d))
* make sure new lessons are picked up ([#5](https://github.com/Bakaface/tutorialkit.rb/issues/5)) ([e9e38c5](https://github.com/Bakaface/tutorialkit.rb/commit/e9e38c539c18de776fdba4f298f6a6da2eb6f10c))
* make sure vite-plugin-inspect is only included in dev mode ([#39](https://github.com/Bakaface/tutorialkit.rb/issues/39)) ([efeed8f](https://github.com/Bakaface/tutorialkit.rb/commit/efeed8ff1c603228b58e9b583fe5304c4480a509))
* minor bug fixes for previews ([#3](https://github.com/Bakaface/tutorialkit.rb/issues/3)) ([884ddfd](https://github.com/Bakaface/tutorialkit.rb/commit/884ddfd94bbcbc15645552320ed7f957d4b5c655))
* missing preview i18n ([#255](https://github.com/Bakaface/tutorialkit.rb/issues/255)) ([095ed57](https://github.com/Bakaface/tutorialkit.rb/commit/095ed570702d1b8de9370565b94103cd0740c408))
* mobile fixes and basic i18n support ([#127](https://github.com/Bakaface/tutorialkit.rb/issues/127)) ([f85e8eb](https://github.com/Bakaface/tutorialkit.rb/commit/f85e8eb6058473b0ad2e061d39e14d111f3f34fe))
* **nav:** make sure nav is on top of the content ([#72](https://github.com/Bakaface/tutorialkit.rb/issues/72)) ([cd4ecc7](https://github.com/Bakaface/tutorialkit.rb/commit/cd4ecc756dde3d2d74326154c7ba700c967f8b97))
* only update files when changed ([df014ee](https://github.com/Bakaface/tutorialkit.rb/commit/df014eee2be0934f0ce4301e706438df4039abd8))
* prevent overwriting template files via `<FileTree>` ([#336](https://github.com/Bakaface/tutorialkit.rb/issues/336)) ([23ed41c](https://github.com/Bakaface/tutorialkit.rb/commit/23ed41c827073a205a2ceaa78973a9200a84c72d))
* **PreviewPanel:** use spread and don't forward the component tree as children ([#2](https://github.com/Bakaface/tutorialkit.rb/issues/2)) ([f2067c2](https://github.com/Bakaface/tutorialkit.rb/commit/f2067c2d6cdb1220423abd9ce7726150813621e6))
* **preview:** temporarily disable auto reload ([474a83d](https://github.com/Bakaface/tutorialkit.rb/commit/474a83d08bda5a887df1b0a51466a7a62d403898))
* problem with creating lessons without solution files ([#108](https://github.com/Bakaface/tutorialkit.rb/issues/108)) ([2d51ff7](https://github.com/Bakaface/tutorialkit.rb/commit/2d51ff713688e34cf3e6140ff4ac4df2a574f6a4))
* **react:** allow preview panel to be fully collapsed ([#445](https://github.com/Bakaface/tutorialkit.rb/issues/445)) ([11aa9ad](https://github.com/Bakaface/tutorialkit.rb/commit/11aa9ad338de76cf0fe18d18d889504faea1c40c))
* **react:** editor and preview missing accessible names ([#267](https://github.com/Bakaface/tutorialkit.rb/issues/267)) ([bcbffe6](https://github.com/Bakaface/tutorialkit.rb/commit/bcbffe6df0321aca1f649d26b09d9c3c8f8e4b7c))
* **react:** file tree scroll visibility ([#399](https://github.com/Bakaface/tutorialkit.rb/issues/399)) ([e1e9160](https://github.com/Bakaface/tutorialkit.rb/commit/e1e916044cc225dab925bd846d9208181f2080e1))
* **react:** file tree's files to indicate selected state ([#268](https://github.com/Bakaface/tutorialkit.rb/issues/268)) ([bd8a3be](https://github.com/Bakaface/tutorialkit.rb/commit/bd8a3be8165b4a66efd550370fd5a7bebb9e62aa))
* **react:** refresh preview when `autoReload: true` ([#303](https://github.com/Bakaface/tutorialkit.rb/issues/303)) ([9754b26](https://github.com/Bakaface/tutorialkit.rb/commit/9754b2671c9e896a63ca49053fc1dde78a88e0c7))
* **react:** solve-button not working before lesson loads ([#266](https://github.com/Bakaface/tutorialkit.rb/issues/266)) ([547e70a](https://github.com/Bakaface/tutorialkit.rb/commit/547e70a090d4509a60e9fc776f5abd3eb4315477))
* **react:** stale lesson data after navigation ([#318](https://github.com/Bakaface/tutorialkit.rb/issues/318)) ([2b5fc92](https://github.com/Bakaface/tutorialkit.rb/commit/2b5fc92fe962fee63b4d2f2efcce04602157268b))
* remove `downloadAsZip` from template for now ([#416](https://github.com/Bakaface/tutorialkit.rb/issues/416)) ([705fead](https://github.com/Bakaface/tutorialkit.rb/commit/705fead006988a4ae865c9171062bd7d3afb3206))
* remove unused schemas and entities folders from template ([#12](https://github.com/Bakaface/tutorialkit.rb/issues/12)) ([de3c4f9](https://github.com/Bakaface/tutorialkit.rb/commit/de3c4f97ecfa9d6228e65d5eaade1a42f44d1e10))
* reset/solve bugs ([38004f2](https://github.com/Bakaface/tutorialkit.rb/commit/38004f26121280106469af88f2a9b96b8eb7212d))
* resize handle for previews ([c9fad67](https://github.com/Bakaface/tutorialkit.rb/commit/c9fad678d80976d60f4afaf49568f8ef82eb5448))
* selection was broken ([9a808ee](https://github.com/Bakaface/tutorialkit.rb/commit/9a808ee60fd7351686febc6a56237a011bd27835))
* send lesson updates as a single mount and preview fixes ([#32](https://github.com/Bakaface/tutorialkit.rb/issues/32)) ([272e4a3](https://github.com/Bakaface/tutorialkit.rb/commit/272e4a3171735334347dd8144913fd952c3e9ff5))
* set min-height for header and fix issue with resize handle ([5511b80](https://github.com/Bakaface/tutorialkit.rb/commit/5511b80860a87d803d4e58fbf5689ddc94ad506b))
* solve shows lesson-only files empty ([#168](https://github.com/Bakaface/tutorialkit.rb/issues/168)) ([bbb13f7](https://github.com/Bakaface/tutorialkit.rb/commit/bbb13f7251a5259a3f7b4fc8300d0b308828bd73))
* sort navigation items numerically in `objectToSortedArray` function ([#56](https://github.com/Bakaface/tutorialkit.rb/issues/56)) ([e45f62b](https://github.com/Bakaface/tutorialkit.rb/commit/e45f62b68952228dd1facd55c2db5bd9f5247e42))
* static routes and missing css shortcut ([912caad](https://github.com/Bakaface/tutorialkit.rb/commit/912caada100dd46b4fa16b5ffe7edfbf4d73866b))
* support a base different from / in astro config ([#92](https://github.com/Bakaface/tutorialkit.rb/issues/92)) ([3e7830b](https://github.com/Bakaface/tutorialkit.rb/commit/3e7830be7ed1fda9598c569eaad9878aa9d10156))
* support inheritance for `editor`/`focus` and fix bug with logo ([#67](https://github.com/Bakaface/tutorialkit.rb/issues/67)) ([a7eb31d](https://github.com/Bakaface/tutorialkit.rb/commit/a7eb31dcaa039292870a78fae979efd6c0ece134))
* switch default `meta.image` to `.png` ([#427](https://github.com/Bakaface/tutorialkit.rb/issues/427)) ([d39bf40](https://github.com/Bakaface/tutorialkit.rb/commit/d39bf404bc1947c48b5cb15164f20f67c0be49bc))
* tag should be the version without the 'v' ([#121](https://github.com/Bakaface/tutorialkit.rb/issues/121)) ([d292d0b](https://github.com/Bakaface/tutorialkit.rb/commit/d292d0b01b0f668a098c20d63bf819077574d31e))
* **terminal:** change behaviour of terminal configuration ([#44](https://github.com/Bakaface/tutorialkit.rb/issues/44)) ([2cd9fec](https://github.com/Bakaface/tutorialkit.rb/commit/2cd9fecacae10f473f9c000375861e2f59539d41))
* **terminal:** fix selection background in light mode ([#45](https://github.com/Bakaface/tutorialkit.rb/issues/45)) ([55de9ed](https://github.com/Bakaface/tutorialkit.rb/commit/55de9ed94616caa489750839f2ec65505089d766))
* **theme:** apply `fast-glob` Windows work-around for all `\@` matches ([#383](https://github.com/Bakaface/tutorialkit.rb/issues/383)) ([9f4bd13](https://github.com/Bakaface/tutorialkit.rb/commit/9f4bd13270f877b9f52e6b85eca5693c283ee249))
* **theme:** fix some styling for the editor ([#100](https://github.com/Bakaface/tutorialkit.rb/issues/100)) ([0f5dd45](https://github.com/Bakaface/tutorialkit.rb/commit/0f5dd4540cf65535ce3b834846f7dd2029551987))
* **theme:** invalid CSS variable on cm-gutter ([#98](https://github.com/Bakaface/tutorialkit.rb/issues/98)) ([039f871](https://github.com/Bakaface/tutorialkit.rb/commit/039f8714df8401a81472d134786029212c7d0d44))
* **theme:** set correct background and text color for panels ([#94](https://github.com/Bakaface/tutorialkit.rb/issues/94)) ([3ad01a0](https://github.com/Bakaface/tutorialkit.rb/commit/3ad01a0cc1055c1f1ffd7b220785f4be1d8d0669))
* **theme:** use correct tokens for the breadcrumbs ([#88](https://github.com/Bakaface/tutorialkit.rb/issues/88)) ([1669299](https://github.com/Bakaface/tutorialkit.rb/commit/1669299c988b8680dda4360e8f02d64c601ad48d))
* **tutorial-runner:** always re-apply template to avoid missing file errors ([ab92faf](https://github.com/Bakaface/tutorialkit.rb/commit/ab92faf68e436691acf6bdbd53d8e8ebee709461))
* **tutorial-runner:** do not print empty new line for non-runnable command ([#23](https://github.com/Bakaface/tutorialkit.rb/issues/23)) ([c3a6cee](https://github.com/Bakaface/tutorialkit.rb/commit/c3a6cee15cff928eb91798a401b284931e6f6671))
* update `pnpm/action-setup` to v4 to fix CI issue ([#114](https://github.com/Bakaface/tutorialkit.rb/issues/114)) ([e36c455](https://github.com/Bakaface/tutorialkit.rb/commit/e36c455a783b5f79c9f321b865eedcd215bcf107))
* updateDocument cannot depend on editorDocument otherwise this causes downstream issues ([503db6b](https://github.com/Bakaface/tutorialkit.rb/commit/503db6b6d36553c0bbf0c374dbaa24a4343defe5))
* updateDocument depends on the lesson ([f0b146c](https://github.com/Bakaface/tutorialkit.rb/commit/f0b146c2c98fbf977a3582415016b6943354ee3d))
* use `meta.title` as default `<title>` ([#454](https://github.com/Bakaface/tutorialkit.rb/issues/454)) ([482b0e3](https://github.com/Bakaface/tutorialkit.rb/commit/482b0e3069a1177562dff44917e30e494769ace7))
* use part title instead of slug for page title ([#40](https://github.com/Bakaface/tutorialkit.rb/issues/40)) ([dc11ccc](https://github.com/Bakaface/tutorialkit.rb/commit/dc11cccde48af65715bac9ab23be0ff3ead3649c))
* **validation:** allow activePanel to be 0 ([#46](https://github.com/Bakaface/tutorialkit.rb/issues/46)) ([4ab76f5](https://github.com/Bakaface/tutorialkit.rb/commit/4ab76f54e94dd7d47400ae558257f23763919ea9))
* warn when using `.svg` in `meta.image` ([#377](https://github.com/Bakaface/tutorialkit.rb/issues/377)) ([6e1edc1](https://github.com/Bakaface/tutorialkit.rb/commit/6e1edc1af274d0eb65587f358e5db9557d259171))


### Features

* `tutorialkit eject` command ([#81](https://github.com/Bakaface/tutorialkit.rb/issues/81)) ([c802668](https://github.com/Bakaface/tutorialkit.rb/commit/c802668aa39875052ac917952bee8d491dde1557))
* add 'Open in StackBlitz'-button ([#219](https://github.com/Bakaface/tutorialkit.rb/issues/219)) ([af428c8](https://github.com/Bakaface/tutorialkit.rb/commit/af428c84f0cd817debd336dc43e88c19583800ce))
* add "Edit this page" link ([#130](https://github.com/Bakaface/tutorialkit.rb/issues/130)) ([dd9c52c](https://github.com/Bakaface/tutorialkit.rb/commit/dd9c52c6f1d3c90cc1d993d8c0fec61dadfc5815))
* add `@tutorialkit/theme` package to use the theme without astro ([#105](https://github.com/Bakaface/tutorialkit.rb/issues/105)) ([9805996](https://github.com/Bakaface/tutorialkit.rb/commit/9805996a4211a1c8a3e1bfbbd958a27f1957d4d7))
* add `contentSchema` ([#156](https://github.com/Bakaface/tutorialkit.rb/issues/156)) ([bc0fde2](https://github.com/Bakaface/tutorialkit.rb/commit/bc0fde26025465f5ab1fa71613d92293f0dafa89))
* add autoreload feature ([2532978](https://github.com/Bakaface/tutorialkit.rb/commit/2532978156b6b8f929f408698ea3fd6f8a82efba))
* add basic terminal ([9ce830d](https://github.com/Bakaface/tutorialkit.rb/commit/9ce830d521900fc211496b579e9b6accc7f180c2))
* add bootscreen and Command/Commands helper classes ([24f066d](https://github.com/Bakaface/tutorialkit.rb/commit/24f066d2a2e14fbbde644fc94f6625e8b1d25b39))
* add code editor ([549b588](https://github.com/Bakaface/tutorialkit.rb/commit/549b588095d7a41fb89258a85b3dc9812f4ddbae))
* add create-tutorial package ([#47](https://github.com/Bakaface/tutorialkit.rb/issues/47)) ([e720657](https://github.com/Bakaface/tutorialkit.rb/commit/e7206578ac29212cab211f988ea2c8f7dcbe00d1))
* add editor persistence ([556e9e2](https://github.com/Bakaface/tutorialkit.rb/commit/556e9e2422ee29118ad9dc654d22d9c6be35efac))
* add eslint ([#90](https://github.com/Bakaface/tutorialkit.rb/issues/90)) ([fcfb3e8](https://github.com/Bakaface/tutorialkit.rb/commit/fcfb3e8109b5be1ef59ac2bfd8efd4db8e635e34))
* add file extension based icons ([#369](https://github.com/Bakaface/tutorialkit.rb/issues/369)) ([ff39cdc](https://github.com/Bakaface/tutorialkit.rb/commit/ff39cdc258764c8d4d1bebe2dce2795fe10e1870))
* add files via file tree ([#314](https://github.com/Bakaface/tutorialkit.rb/issues/314)) ([7782bdc](https://github.com/Bakaface/tutorialkit.rb/commit/7782bdc6e7da0429061c881ac2f95829f149a907))
* add gh workflow for publishing forked packages ([34c6e16](https://github.com/Bakaface/tutorialkit.rb/commit/34c6e16ce83ca52de0488b986bf2406de07cc3d6))
* add initial adjustments for packages ([c2a64f2](https://github.com/Bakaface/tutorialkit.rb/commit/c2a64f25e4a842bfa9bf4a3c7b2a56a46c22aaf7))
* add lezer support for wast via codemirror wast package ([#65](https://github.com/Bakaface/tutorialkit.rb/issues/65)) ([0ce2986](https://github.com/Bakaface/tutorialkit.rb/commit/0ce2986077a5c8384a7f118bab9d8820ff707c72))
* add link to webcontainers.io ([#202](https://github.com/Bakaface/tutorialkit.rb/issues/202)) ([70d20c7](https://github.com/Bakaface/tutorialkit.rb/commit/70d20c7b3801b458aa11c7d70a11ea1392d0fa60))
* add markdown styling ([6c05d18](https://github.com/Bakaface/tutorialkit.rb/commit/6c05d18ed9dcdcdf27c3c47e2efc90aab8cc5aa4))
* add MDX extension to `recommendations` in extensions.json ([#55](https://github.com/Bakaface/tutorialkit.rb/issues/55)) ([2d0a1fa](https://github.com/Bakaface/tutorialkit.rb/commit/2d0a1fafab4d65236e196fe101e26535a24b3105))
* add metadata inheritance ([2b29d6c](https://github.com/Bakaface/tutorialkit.rb/commit/2b29d6cc126ec58d7833245e9b4fe91856a7f5e0))
* add nav with breadcrumb and menu ([3e9de9f](https://github.com/Bakaface/tutorialkit.rb/commit/3e9de9f7b83ec4a3212537a2c19811fc520b2fbb))
* add possibility to filter the preview url with a port ([914c22a](https://github.com/Bakaface/tutorialkit.rb/commit/914c22a970c36e877356424759d97a4540c51941))
* add publish script ([7988989](https://github.com/Bakaface/tutorialkit.rb/commit/79889893bd9d95a8094ca643e2149363939a84f6))
* add simple package.json to the first example to have deps to install ([e5ae75d](https://github.com/Bakaface/tutorialkit.rb/commit/e5ae75d60a0f8cca081b2fe0b4a075bc3997fbba))
* add support for multiple previews ([8588e95](https://github.com/Bakaface/tutorialkit.rb/commit/8588e95e5f534cd0d438a2ba9ddf89b4d84a7f89))
* add support for StackBlitz Enterprise ([#7](https://github.com/Bakaface/tutorialkit.rb/issues/7)) ([fc07161](https://github.com/Bakaface/tutorialkit.rb/commit/fc071619994d5e1a54c1f825c471a2bf33a8513d))
* add Svelte language to CodeMirror ([#212](https://github.com/Bakaface/tutorialkit.rb/issues/212)) ([359c0e0](https://github.com/Bakaface/tutorialkit.rb/commit/359c0e05c91c437066ff9a19a61bb74365faf3f0))
* add tasks utilities and basic tutorial runner ([22c619b](https://github.com/Bakaface/tutorialkit.rb/commit/22c619b853cd49f6b7a2a75f2d8a0cee82a3334e))
* add very basic loadFiles to TutorialRunner ([71b96a0](https://github.com/Bakaface/tutorialkit.rb/commit/71b96a0687fd7d6f140cf1966fe2f4f1ed362e3c))
* add vscode extension ([#109](https://github.com/Bakaface/tutorialkit.rb/issues/109)) ([33a69f9](https://github.com/Bakaface/tutorialkit.rb/commit/33a69f9de5d163029b78133b129147ff23a6de0b))
* add Vue language to CodeMirror ([#256](https://github.com/Bakaface/tutorialkit.rb/issues/256)) ([f9b265f](https://github.com/Bakaface/tutorialkit.rb/commit/f9b265f7372c8246a4ccf2d41f0be8fe44d30aa7))
* allow custom `src/pages/index.astro` ([#93](https://github.com/Bakaface/tutorialkit.rb/issues/93)) ([d431d4d](https://github.com/Bakaface/tutorialkit.rb/commit/d431d4d4908f28184cd7d2f75faffe2c77a3ef4c))
* allow custom components that modify the tutorial state ([#64](https://github.com/Bakaface/tutorialkit.rb/issues/64)) ([1279917](https://github.com/Bakaface/tutorialkit.rb/commit/1279917be042580033f23605e92f903ecd186e19))
* allow ordering to be config based in addition to folder based ([#79](https://github.com/Bakaface/tutorialkit.rb/issues/79)) ([2b131e5](https://github.com/Bakaface/tutorialkit.rb/commit/2b131e597b94671678c2f2e4625e194eb382dab0))
* **astro:** add "Download lesson as zip" button ([#415](https://github.com/Bakaface/tutorialkit.rb/issues/415)) ([9c6e534](https://github.com/Bakaface/tutorialkit.rb/commit/9c6e5349b6ab7e7399437839f6fc4cf11bd6c5c3))
* **astro:** add `custom` configuration option for passing custom fields ([#378](https://github.com/Bakaface/tutorialkit.rb/issues/378)) ([7c6ede9](https://github.com/Bakaface/tutorialkit.rb/commit/7c6ede95730150b68be763d4c87f1da1bc42503c))
* **astro:** add sensible default canonical url ([#437](https://github.com/Bakaface/tutorialkit.rb/issues/437)) ([1a5ea33](https://github.com/Bakaface/tutorialkit.rb/commit/1a5ea333744c524316a5d6348d8bd0ccf2e76ca7))
* **astro:** custom expressive code plugins ([#444](https://github.com/Bakaface/tutorialkit.rb/issues/444)) ([d586225](https://github.com/Bakaface/tutorialkit.rb/commit/d586225d11e900b6a63d7e3c9afdf1d04aa6485c))
* **astro:** override components to support `Dialog` ([#345](https://github.com/Bakaface/tutorialkit.rb/issues/345)) ([61a542e](https://github.com/Bakaface/tutorialkit.rb/commit/61a542e7e13b3eaf52b04624954398a8d95a8d46))
* **astro:** override components to support `HeadTags` ([#375](https://github.com/Bakaface/tutorialkit.rb/issues/375)) ([e93d11a](https://github.com/Bakaface/tutorialkit.rb/commit/e93d11a11b8a01dc6de859842b0dc675b01008de))
* **astro:** preserve file path for imported file code blocks ([#446](https://github.com/Bakaface/tutorialkit.rb/issues/446)) ([df69da2](https://github.com/Bakaface/tutorialkit.rb/commit/df69da20e01d4cbed26a3f314f787e4e1ed015b9))
* **astro:** support lessons without parts or chapters ([#374](https://github.com/Bakaface/tutorialkit.rb/issues/374)) ([8c44cbe](https://github.com/Bakaface/tutorialkit.rb/commit/8c44cbec3f276a4f788b5d1652f67e4cf8cf7948))
* augment commands with a title ([8d75fb4](https://github.com/Bakaface/tutorialkit.rb/commit/8d75fb4c711cf70c79ec65b35acda30747bc3a72))
* clear preview url when the server is closed ([3a0f28c](https://github.com/Bakaface/tutorialkit.rb/commit/3a0f28c5ed7e70039901e14c7a2dff7ceb3f2f3b))
* **cli:** add vs code extension to recommendations ([#172](https://github.com/Bakaface/tutorialkit.rb/issues/172)) ([f6fd489](https://github.com/Bakaface/tutorialkit.rb/commit/f6fd48986c4760447c11743174c3448b9b733c4f))
* **cli:** project creation to prompt hosting provider settings ([#440](https://github.com/Bakaface/tutorialkit.rb/issues/440)) ([efd7ee7](https://github.com/Bakaface/tutorialkit.rb/commit/efd7ee73382dc4f627b38a7ee731cb96bc3420b8))
* **content:** allow to configure preview port and url ([e35b5b6](https://github.com/Bakaface/tutorialkit.rb/commit/e35b5b694a66bb8d97a8e65ef00854ffd903f7b9))
* **editor:** add option to enable auto focus ([41dded0](https://github.com/Bakaface/tutorialkit.rb/commit/41dded0f9dc827afbb40b488b401e809c71ca6f0))
* **editor:** allow hiding the editor entirely ([#35](https://github.com/Bakaface/tutorialkit.rb/issues/35)) ([4b26db1](https://github.com/Bakaface/tutorialkit.rb/commit/4b26db1b9cf90a28650e31da4ef0004e44bb9c83))
* **extension:** metadata autocompletion ([#143](https://github.com/Bakaface/tutorialkit.rb/issues/143)) ([be0a096](https://github.com/Bakaface/tutorialkit.rb/commit/be0a0965bbd7b553bc6b5b1f4019e22ee0651d30))
* **extension:** support config-based ordering ([#223](https://github.com/Bakaface/tutorialkit.rb/issues/223)) ([3b2c776](https://github.com/Bakaface/tutorialkit.rb/commit/3b2c7763a9af488bf32586708b2af328256e0c41))
* finalize basic i18n support ([#133](https://github.com/Bakaface/tutorialkit.rb/issues/133)) ([09d8bf7](https://github.com/Bakaface/tutorialkit.rb/commit/09d8bf7bd7673abb5b92b7de569daad1b44b07fd))
* first version of tutorial runner integrated with lessons, the preview, and the terminal ([6e099b1](https://github.com/Bakaface/tutorialkit.rb/commit/6e099b1268de5bfb62f9ace232c6fb8c3d748c62))
* folder rework, introduce `@tutorialkit/components-react` ([#17](https://github.com/Bakaface/tutorialkit.rb/issues/17)) ([dd74c49](https://github.com/Bakaface/tutorialkit.rb/commit/dd74c49ec4f021ac53fd320cf5023275fbf12311))
* hide non-content folders by default in vscode / codeflow ([#9](https://github.com/Bakaface/tutorialkit.rb/issues/9)) ([e8dcc96](https://github.com/Bakaface/tutorialkit.rb/commit/e8dcc96d39774dfbf36a3d48117b974cd5d5eaff))
* history is now working as expected ([868b9cd](https://github.com/Bakaface/tutorialkit.rb/commit/868b9cd2524551815409a98cad9db88bd5f815fb))
* hot reload for files in webcontainer ([#61](https://github.com/Bakaface/tutorialkit.rb/issues/61)) ([949fcf3](https://github.com/Bakaface/tutorialkit.rb/commit/949fcf3438e3bf17902d753089372fbc03911136))
* implement theming system and add dark mode ([5363f68](https://github.com/Bakaface/tutorialkit.rb/commit/5363f68c9915674aae5c4ab5ca344f65dc660639))
* implement tutorialkit cli ([9fb1f32](https://github.com/Bakaface/tutorialkit.rb/commit/9fb1f32704e66f8b14ff6dc52aa4f43b7ff7b82b))
* improve file tree ([7d49464](https://github.com/Bakaface/tutorialkit.rb/commit/7d4946419b44ef16e9a60bbff1ea82a65244eb4b))
* initial commit ([f33ac49](https://github.com/Bakaface/tutorialkit.rb/commit/f33ac490e711437e0a76c8fb6652f214f60c88f0))
* load user provided css for theme customization ([#31](https://github.com/Bakaface/tutorialkit.rb/issues/31)) ([4e8452a](https://github.com/Bakaface/tutorialkit.rb/commit/4e8452a3b3142bc9f4cbd56261bc6cdb8573a8e1))
* make core react components easily accessible ([#104](https://github.com/Bakaface/tutorialkit.rb/issues/104)) ([d8a5a34](https://github.com/Bakaface/tutorialkit.rb/commit/d8a5a341df6c2d23d1d59ede61b4d3ef689af081))
* make the logo link configurable ([#68](https://github.com/Bakaface/tutorialkit.rb/issues/68)) ([2da64ae](https://github.com/Bakaface/tutorialkit.rb/commit/2da64ae811cbb12aeab8fd1fb36bed4845542aa4))
* mark `@tutorialkit/react` component API as experimental feature ([#346](https://github.com/Bakaface/tutorialkit.rb/issues/346)) ([67042ef](https://github.com/Bakaface/tutorialkit.rb/commit/67042efba00dbfa738d2eeff06e3104b4292a486))
* **markdown:** add ability to load file for code blocks ([#18](https://github.com/Bakaface/tutorialkit.rb/issues/18)) ([9b57454](https://github.com/Bakaface/tutorialkit.rb/commit/9b57454eb46dee76949f67c5c31edf1103f7110c))
* memoize preview panel ([d969880](https://github.com/Bakaface/tutorialkit.rb/commit/d9698806b6007dd964267bb03eb949efdc53b81e))
* minimally integrate WebContainer ([8ece71c](https://github.com/Bakaface/tutorialkit.rb/commit/8ece71c9321fe9bcd184969497210aa3b91a11d4))
* mobile support ([#91](https://github.com/Bakaface/tutorialkit.rb/issues/91)) ([030ca1e](https://github.com/Bakaface/tutorialkit.rb/commit/030ca1ee688f75f6e59ae25a1b2433823ade384f))
* preserve webcontainer iframe between pages ([7080d55](https://github.com/Bakaface/tutorialkit.rb/commit/7080d553c77a52ee0542352ccb6973a20b00c886))
* **previews:** allow hiding the previews entirely ([#41](https://github.com/Bakaface/tutorialkit.rb/issues/41)) ([84ecef5](https://github.com/Bakaface/tutorialkit.rb/commit/84ecef5aecacba37873977fbb19ef64d65d10c14))
* **react:** add button to reload a preview ([#305](https://github.com/Bakaface/tutorialkit.rb/issues/305)) ([d14c404](https://github.com/Bakaface/tutorialkit.rb/commit/d14c4045ad692a45b5b388bb4cfcca9762e6142c))
* remove custom swap in favor of the new swap apis ([#4](https://github.com/Bakaface/tutorialkit.rb/issues/4)) ([67f2c57](https://github.com/Bakaface/tutorialkit.rb/commit/67f2c571efa81ecfb52fc1efe1ac2592eccc4f01))
* rename `@tutorialkit/components-react` to `@tutorialkit/react` ([#155](https://github.com/Bakaface/tutorialkit.rb/issues/155)) ([e3c0fee](https://github.com/Bakaface/tutorialkit.rb/commit/e3c0fee902a7bfc312fb01b30531209815d460c3))
* rename `tutorialkit` to `@tutorialkit/cli` ([#153](https://github.com/Bakaface/tutorialkit.rb/issues/153)) ([2986157](https://github.com/Bakaface/tutorialkit.rb/commit/298615748b1f2d3ea737c591ce193eb0d28407ca))
* rework `_files`, `_solution` and multi-template support ([#6](https://github.com/Bakaface/tutorialkit.rb/issues/6)) ([bdd60c7](https://github.com/Bakaface/tutorialkit.rb/commit/bdd60c7a31983854a30442cec22deabf8f0ea4f8))
* **runtime:** `fs.watch` to support syncing new files from webcontainer ([#394](https://github.com/Bakaface/tutorialkit.rb/issues/394)) ([3beda90](https://github.com/Bakaface/tutorialkit.rb/commit/3beda905df20ed9c7d286fc02007cf5b2e74835a))
* **runtime:** add `preview.pathname` ([#233](https://github.com/Bakaface/tutorialkit.rb/issues/233)) ([9bf2156](https://github.com/Bakaface/tutorialkit.rb/commit/9bf2156df26656427482645d3d134127863de233))
* **runtime:** add `terminal.input` for writing to stdin ([#350](https://github.com/Bakaface/tutorialkit.rb/issues/350)) ([c0b8f41](https://github.com/Bakaface/tutorialkit.rb/commit/c0b8f41a28259cc19d7049be2506a5b246d6f32d))
* **runtime:** option for setting terminal open by default ([#246](https://github.com/Bakaface/tutorialkit.rb/issues/246)) ([5419038](https://github.com/Bakaface/tutorialkit.rb/commit/5419038d1c0a6f80da4d9f31e330d0dc0e41def8))
* send SIGWINCH to current process ([9500ed6](https://github.com/Bakaface/tutorialkit.rb/commit/9500ed63354c4ce5d067e996122d6e69d97e86da))
* set default package manager to the one used with `create` command ([#57](https://github.com/Bakaface/tutorialkit.rb/issues/57)) ([c97278e](https://github.com/Bakaface/tutorialkit.rb/commit/c97278e94292a2f4cfd76a75cb31e540b5c0d230))
* setup initial template ([37c95ef](https://github.com/Bakaface/tutorialkit.rb/commit/37c95ef472ef6b7b17d0c0f755d0876146d66a3f))
* simplify astro config ([#20](https://github.com/Bakaface/tutorialkit.rb/issues/20)) ([b2b2bfb](https://github.com/Bakaface/tutorialkit.rb/commit/b2b2bfbfd224657d114a537a96064d55bd069b91))
* simplify UnoCSS integration ([#270](https://github.com/Bakaface/tutorialkit.rb/issues/270)) ([8d49ef8](https://github.com/Bakaface/tutorialkit.rb/commit/8d49ef81272d84cbfa2c1a10742f01540fe3650c))
* small theme improvement ([d592f8d](https://github.com/Bakaface/tutorialkit.rb/commit/d592f8dc415249fc32a8881bf064b36172f5df6a))
* **store:** fix current document and add onDocumentChanged ([#74](https://github.com/Bakaface/tutorialkit.rb/issues/74)) ([05b1688](https://github.com/Bakaface/tutorialkit.rb/commit/05b1688718ab6e8d7d55c09e892c7f1faef9116e))
* support glob patterns in `editor.fileTree.allowEdits` ([#332](https://github.com/Bakaface/tutorialkit.rb/issues/332)) ([c1a59f5](https://github.com/Bakaface/tutorialkit.rb/commit/c1a59f54c5b5700b8ec8ed5a4a3ebf2169b2409c))
* support overriding `TopBar` ([#112](https://github.com/Bakaface/tutorialkit.rb/issues/112)) ([3792aa9](https://github.com/Bakaface/tutorialkit.rb/commit/3792aa99103ed2461c9b4922838fec7fbcb5dec7))
* sync files from WebContainer to editor ([#334](https://github.com/Bakaface/tutorialkit.rb/issues/334)) ([5c1de69](https://github.com/Bakaface/tutorialkit.rb/commit/5c1de69c0e4e233a25a2f9b70fbb1f6c93f12356))
* template inheritance ([#99](https://github.com/Bakaface/tutorialkit.rb/issues/99)) ([c4350a8](https://github.com/Bakaface/tutorialkit.rb/commit/c4350a8032d0d24ac9250be8b81869ddae88a538))
* **terminal:** add support for redirects and allow specific commands ([#76](https://github.com/Bakaface/tutorialkit.rb/issues/76)) ([eca5f22](https://github.com/Bakaface/tutorialkit.rb/commit/eca5f22e3120c4d59349f416322b990d37cb0c15))
* **terminal:** add support for terminals ([#33](https://github.com/Bakaface/tutorialkit.rb/issues/33)) ([53c902b](https://github.com/Bakaface/tutorialkit.rb/commit/53c902bcdc30f3c39f9b2a737e6da1dabd09dabf))
* **terminal:** allow styling terminal with css tokens ([#34](https://github.com/Bakaface/tutorialkit.rb/issues/34)) ([80ccfe7](https://github.com/Bakaface/tutorialkit.rb/commit/80ccfe75eff511583de8d1155652714a65edc1ed))
* **terminal:** support linking terminals between lessons ([#36](https://github.com/Bakaface/tutorialkit.rb/issues/36)) ([f4237b7](https://github.com/Bakaface/tutorialkit.rb/commit/f4237b7401cb7709e4546f11465420bf5aff8f2d))
* **theme:** add support for setting text and code colors in callouts ([#96](https://github.com/Bakaface/tutorialkit.rb/issues/96)) ([623b04d](https://github.com/Bakaface/tutorialkit.rb/commit/623b04da18e5545a6d29b03a60571b1fb5bc2db1))
* **theme:** create proper tokens for callouts ([#87](https://github.com/Bakaface/tutorialkit.rb/issues/87)) ([6d01620](https://github.com/Bakaface/tutorialkit.rb/commit/6d01620f65c2386d98864246f8fe87e53c76c78f))
* when preview port changes update the preview url if a server is already listening on that port ([d1c477a](https://github.com/Bakaface/tutorialkit.rb/commit/d1c477ada708012190b70d8911bc040a0995bdbe))
* wip set / reset solution, the editor is not updated yet ([110b289](https://github.com/Bakaface/tutorialkit.rb/commit/110b28987fac8a551ee309ac43587a09c4061b3c))


### BREAKING CHANGES

* mark `@tutorialkit/react` component API as experimental feature (#346)
* rename `@tutorialkit/components-react` to `@tutorialkit/react` (#155)
* simplify UnoCSS integration (#270)



## [1.5.2](https://github.com/stackblitz/tutorialkit/compare/1.5.0...1.5.2) (2025-06-17)


### Bug Fixes

* headers not matching the documentation ([#451](https://github.com/stackblitz/tutorialkit/issues/451)) ([8588436](https://github.com/stackblitz/tutorialkit/commit/8588436a611bda02c7dbeec49b32d43f7ac1c8b5))
* use `meta.title` as default `<title>` ([#454](https://github.com/stackblitz/tutorialkit/issues/454)) ([482b0e3](https://github.com/stackblitz/tutorialkit/commit/482b0e3069a1177562dff44917e30e494769ace7))



## [1.5.1](https://github.com/stackblitz/tutorialkit/compare/1.5.0...1.5.1) (2025-06-17)


### Bug Fixes

* headers not matching the documentation ([#451](https://github.com/stackblitz/tutorialkit/issues/451)) ([8588436](https://github.com/stackblitz/tutorialkit/commit/8588436a611bda02c7dbeec49b32d43f7ac1c8b5))
* use `meta.title` as default `<title>` ([#454](https://github.com/stackblitz/tutorialkit/issues/454)) ([482b0e3](https://github.com/stackblitz/tutorialkit/commit/482b0e3069a1177562dff44917e30e494769ace7))



# [1.5.0](https://github.com/stackblitz/tutorialkit/compare/1.4.0...1.5.0) (2025-04-16)


### Bug Fixes

* **react:** allow preview panel to be fully collapsed ([#445](https://github.com/stackblitz/tutorialkit/issues/445)) ([11aa9ad](https://github.com/stackblitz/tutorialkit/commit/11aa9ad338de76cf0fe18d18d889504faea1c40c))


### Features

* **astro:** custom expressive code plugins ([#444](https://github.com/stackblitz/tutorialkit/issues/444)) ([d586225](https://github.com/stackblitz/tutorialkit/commit/d586225d11e900b6a63d7e3c9afdf1d04aa6485c))
* **astro:** preserve file path for imported file code blocks ([#446](https://github.com/stackblitz/tutorialkit/issues/446)) ([df69da2](https://github.com/stackblitz/tutorialkit/commit/df69da20e01d4cbed26a3f314f787e4e1ed015b9))



# [1.4.0](https://github.com/stackblitz/tutorialkit/compare/1.3.1...1.4.0) (2025-03-31)


### Features

* **astro:** add sensible default canonical url ([#437](https://github.com/stackblitz/tutorialkit/issues/437)) ([1a5ea33](https://github.com/stackblitz/tutorialkit/commit/1a5ea333744c524316a5d6348d8bd0ccf2e76ca7))
* **cli:** project creation to prompt hosting provider settings ([#440](https://github.com/stackblitz/tutorialkit/issues/440)) ([efd7ee7](https://github.com/stackblitz/tutorialkit/commit/efd7ee73382dc4f627b38a7ee731cb96bc3420b8))



## [1.3.1](https://github.com/stackblitz/tutorialkit/compare/1.3.0...1.3.1) (2024-11-25)


### Bug Fixes

* **astro:** allow URLs in `meta.image` ([#422](https://github.com/stackblitz/tutorialkit/issues/422)) ([3125547](https://github.com/stackblitz/tutorialkit/commit/3125547c043fe4a76dca95b1eb973362967ccf02))
* switch default `meta.image` to `.png` ([#427](https://github.com/stackblitz/tutorialkit/issues/427)) ([d39bf40](https://github.com/stackblitz/tutorialkit/commit/d39bf404bc1947c48b5cb15164f20f67c0be49bc))
* warn when using `.svg` in `meta.image` ([#377](https://github.com/stackblitz/tutorialkit/issues/377)) ([6e1edc1](https://github.com/stackblitz/tutorialkit/commit/6e1edc1af274d0eb65587f358e5db9557d259171))



# [1.3.0](https://github.com/stackblitz/tutorialkit/compare/1.2.2...1.3.0) (2024-11-15)


### Bug Fixes

* remove `downloadAsZip` from template for now ([#416](https://github.com/stackblitz/tutorialkit/issues/416)) ([705fead](https://github.com/stackblitz/tutorialkit/commit/705fead006988a4ae865c9171062bd7d3afb3206))


### Features

* **astro:** add "Download lesson as zip" button ([#415](https://github.com/stackblitz/tutorialkit/issues/415)) ([9c6e534](https://github.com/stackblitz/tutorialkit/commit/9c6e5349b6ab7e7399437839f6fc4cf11bd6c5c3))
* **astro:** support lessons without parts or chapters ([#374](https://github.com/stackblitz/tutorialkit/issues/374)) ([8c44cbe](https://github.com/stackblitz/tutorialkit/commit/8c44cbec3f276a4f788b5d1652f67e4cf8cf7948))



## [1.2.2](https://github.com/stackblitz/tutorialkit/compare/1.2.1...1.2.2) (2024-11-12)


### Bug Fixes

* hide preview container when `previews: false` ([#412](https://github.com/stackblitz/tutorialkit/issues/412)) ([b35de43](https://github.com/stackblitz/tutorialkit/commit/b35de43d437492d124af232adddd2a30ec70ec0e))



## [1.2.1](https://github.com/stackblitz/tutorialkit/compare/1.2.0...1.2.1) (2024-11-05)


### Bug Fixes

* **astro:** optimize CJS dependency `picomatch` ([#406](https://github.com/stackblitz/tutorialkit/issues/406)) ([17a48a6](https://github.com/stackblitz/tutorialkit/commit/17a48a6858912277942d87b8af28a601adfad8da))



# [1.2.0](https://github.com/stackblitz/tutorialkit/compare/1.1.1...1.2.0) (2024-11-05)


### Bug Fixes

* **react:** file tree scroll visibility ([#399](https://github.com/stackblitz/tutorialkit/issues/399)) ([e1e9160](https://github.com/stackblitz/tutorialkit/commit/e1e916044cc225dab925bd846d9208181f2080e1))


### Features

* **runtime:** `fs.watch` to support syncing new files from webcontainer ([#394](https://github.com/stackblitz/tutorialkit/issues/394)) ([3beda90](https://github.com/stackblitz/tutorialkit/commit/3beda905df20ed9c7d286fc02007cf5b2e74835a))



## [1.1.1](https://github.com/stackblitz/tutorialkit/compare/1.1.0...1.1.1) (2024-10-20)


### Bug Fixes

* **theme:** apply `fast-glob` Windows work-around for all `\@` matches ([#383](https://github.com/stackblitz/tutorialkit/issues/383)) ([9f4bd13](https://github.com/stackblitz/tutorialkit/commit/9f4bd13270f877b9f52e6b85eca5693c283ee249))



# [1.1.0](https://github.com/stackblitz/tutorialkit/compare/1.0.0...1.1.0) (2024-10-18)


### Bug Fixes

* **astro:** correct error message when chapter not found ([#361](https://github.com/stackblitz/tutorialkit/issues/361)) ([0510474](https://github.com/stackblitz/tutorialkit/commit/05104741a73180dbaeb583317cd77df104d2d2c7))
* **astro:** types of override components to optional ([#376](https://github.com/stackblitz/tutorialkit/issues/376)) ([0af3848](https://github.com/stackblitz/tutorialkit/commit/0af384889f5a3e7e46ea4803b1b1a631c15d331f))
* **cli:** list `eject` command in `--help` ([#373](https://github.com/stackblitz/tutorialkit/issues/373)) ([bc61229](https://github.com/stackblitz/tutorialkit/commit/bc61229f156db3043b57dd3f85f09b72702a70b0))


### Features

* add file extension based icons ([#369](https://github.com/stackblitz/tutorialkit/issues/369)) ([ff39cdc](https://github.com/stackblitz/tutorialkit/commit/ff39cdc258764c8d4d1bebe2dce2795fe10e1870))
* **astro:** add `custom` configuration option for passing custom fields ([#378](https://github.com/stackblitz/tutorialkit/issues/378)) ([7c6ede9](https://github.com/stackblitz/tutorialkit/commit/7c6ede95730150b68be763d4c87f1da1bc42503c))
* **astro:** override components to support `HeadTags` ([#375](https://github.com/stackblitz/tutorialkit/issues/375)) ([e93d11a](https://github.com/stackblitz/tutorialkit/commit/e93d11a11b8a01dc6de859842b0dc675b01008de))



# [1.0.0](https://github.com/stackblitz/tutorialkit/compare/0.2.3...1.0.0) (2024-10-01)


### Bug Fixes

* **astro:** better default meta tags ([#342](https://github.com/stackblitz/tutorialkit/issues/342)) ([d81d1cc](https://github.com/stackblitz/tutorialkit/commit/d81d1cc01fdbce702ae91a6a5f371bd03c38b338))
* **astro:** published package missing `@tutorialkit/astro/types` ([#347](https://github.com/stackblitz/tutorialkit/issues/347)) ([f49e910](https://github.com/stackblitz/tutorialkit/commit/f49e9107d35b98079a0fb16c74b9f37a45357661))
* prevent overwriting template files via `<FileTree>` ([#336](https://github.com/stackblitz/tutorialkit/issues/336)) ([23ed41c](https://github.com/stackblitz/tutorialkit/commit/23ed41c827073a205a2ceaa78973a9200a84c72d))


### Features

* add files via file tree ([#314](https://github.com/stackblitz/tutorialkit/issues/314)) ([7782bdc](https://github.com/stackblitz/tutorialkit/commit/7782bdc6e7da0429061c881ac2f95829f149a907))
* **astro:** override components to support `Dialog` ([#345](https://github.com/stackblitz/tutorialkit/issues/345)) ([61a542e](https://github.com/stackblitz/tutorialkit/commit/61a542e7e13b3eaf52b04624954398a8d95a8d46))
* mark `@tutorialkit/react` component API as experimental feature ([#346](https://github.com/stackblitz/tutorialkit/issues/346)) ([67042ef](https://github.com/stackblitz/tutorialkit/commit/67042efba00dbfa738d2eeff06e3104b4292a486))
* **runtime:** add `terminal.input` for writing to stdin ([#350](https://github.com/stackblitz/tutorialkit/issues/350)) ([c0b8f41](https://github.com/stackblitz/tutorialkit/commit/c0b8f41a28259cc19d7049be2506a5b246d6f32d))
* support glob patterns in `editor.fileTree.allowEdits` ([#332](https://github.com/stackblitz/tutorialkit/issues/332)) ([c1a59f5](https://github.com/stackblitz/tutorialkit/commit/c1a59f54c5b5700b8ec8ed5a4a3ebf2169b2409c))
* sync files from WebContainer to editor ([#334](https://github.com/stackblitz/tutorialkit/issues/334)) ([5c1de69](https://github.com/stackblitz/tutorialkit/commit/5c1de69c0e4e233a25a2f9b70fbb1f6c93f12356))


### BREAKING CHANGES

* mark `@tutorialkit/react` component API as experimental feature (#346)



## [0.2.3](https://github.com/stackblitz/tutorialkit/compare/0.2.2...0.2.3) (2024-09-10)


### Bug Fixes

* **react:** stale lesson data after navigation ([#318](https://github.com/stackblitz/tutorialkit/issues/318)) ([2b5fc92](https://github.com/stackblitz/tutorialkit/commit/2b5fc92fe962fee63b4d2f2efcce04602157268b))



## [0.2.2](https://github.com/stackblitz/tutorialkit/compare/0.2.1...0.2.2) (2024-09-04)


### Bug Fixes

* align `Powered by WebContainers` to the bottom ([#301](https://github.com/stackblitz/tutorialkit/issues/301)) ([98ef05b](https://github.com/stackblitz/tutorialkit/commit/98ef05b828ff8f3ab45a49e62bf1a4b79e65acfc))
* **react:** refresh preview when `autoReload: true` ([#303](https://github.com/stackblitz/tutorialkit/issues/303)) ([9754b26](https://github.com/stackblitz/tutorialkit/commit/9754b2671c9e896a63ca49053fc1dde78a88e0c7))


### Features

* **react:** add button to reload a preview ([#305](https://github.com/stackblitz/tutorialkit/issues/305)) ([d14c404](https://github.com/stackblitz/tutorialkit/commit/d14c4045ad692a45b5b388bb4cfcca9762e6142c))



## [0.2.1](https://github.com/stackblitz/tutorialkit/compare/0.2.0...0.2.1) (2024-08-30)


### Bug Fixes

* **astro:** work-around for dev-mode's `ReferenceError: __WC_CONFIG__ is not defined` errors ([#293](https://github.com/stackblitz/tutorialkit/issues/293)) ([70fa3e2](https://github.com/stackblitz/tutorialkit/commit/70fa3e2895f2f2c4d25aa3410690297afb49a44b))



# [0.2.0](https://github.com/stackblitz/tutorialkit/compare/0.1.6...0.2.0) (2024-08-28)


### Features

* rename `@tutorialkit/components-react` to `@tutorialkit/react` ([#155](https://github.com/stackblitz/tutorialkit/issues/155)) ([e3c0fee](https://github.com/stackblitz/tutorialkit/commit/e3c0fee902a7bfc312fb01b30531209815d460c3))
* simplify UnoCSS integration ([#270](https://github.com/stackblitz/tutorialkit/issues/270)) ([8d49ef8](https://github.com/stackblitz/tutorialkit/commit/8d49ef81272d84cbfa2c1a10742f01540fe3650c))


### BREAKING CHANGES

* rename `@tutorialkit/components-react` to `@tutorialkit/react` (#155)
* simplify UnoCSS integration (#270)



## [0.1.6](https://github.com/stackblitz/tutorialkit/compare/0.1.5...0.1.6) (2024-08-26)


### Bug Fixes

* **astro/types:** `webcontainer` should be a `Promise<WebContainer>` ([#259](https://github.com/stackblitz/tutorialkit/issues/259)) ([c7bad20](https://github.com/stackblitz/tutorialkit/commit/c7bad203045b702afda3176cece645bee4d4f6e3))
* **cli:** `create-tutorial` not depending on `@tutorialkit/cli` package ([#254](https://github.com/stackblitz/tutorialkit/issues/254)) ([3b480db](https://github.com/stackblitz/tutorialkit/commit/3b480dbd682a8c7657151dc93054f8209fdad312))
* missing preview i18n ([#255](https://github.com/stackblitz/tutorialkit/issues/255)) ([095ed57](https://github.com/stackblitz/tutorialkit/commit/095ed570702d1b8de9370565b94103cd0740c408))
* **react:** editor and preview missing accessible names ([#267](https://github.com/stackblitz/tutorialkit/issues/267)) ([bcbffe6](https://github.com/stackblitz/tutorialkit/commit/bcbffe6df0321aca1f649d26b09d9c3c8f8e4b7c))
* **react:** file tree's files to indicate selected state ([#268](https://github.com/stackblitz/tutorialkit/issues/268)) ([bd8a3be](https://github.com/stackblitz/tutorialkit/commit/bd8a3be8165b4a66efd550370fd5a7bebb9e62aa))
* **react:** solve-button not working before lesson loads ([#266](https://github.com/stackblitz/tutorialkit/issues/266)) ([547e70a](https://github.com/stackblitz/tutorialkit/commit/547e70a090d4509a60e9fc776f5abd3eb4315477))


### Features

* add Vue language to CodeMirror ([#256](https://github.com/stackblitz/tutorialkit/issues/256)) ([f9b265f](https://github.com/stackblitz/tutorialkit/commit/f9b265f7372c8246a4ccf2d41f0be8fe44d30aa7))
* **runtime:** option for setting terminal open by default ([#246](https://github.com/stackblitz/tutorialkit/issues/246)) ([5419038](https://github.com/stackblitz/tutorialkit/commit/5419038d1c0a6f80da4d9f31e330d0dc0e41def8))



## [0.1.5](https://github.com/stackblitz/tutorialkit/compare/0.1.4...0.1.5) (2024-08-16)


### Bug Fixes

* **astro:** don't modify state during re-renders of `<WorkspacePanelWrapper />` ([#240](https://github.com/stackblitz/tutorialkit/issues/240)) ([745be37](https://github.com/stackblitz/tutorialkit/commit/745be37ef20ae97d6ded221fca24670742981879))
* **extension:** only match tutorialkit content and meta files ([#242](https://github.com/stackblitz/tutorialkit/issues/242)) ([9c1b55a](https://github.com/stackblitz/tutorialkit/commit/9c1b55abd0967053782458db4ee41180f26d6c5d))


### Features

* **runtime:** add `preview.pathname` ([#233](https://github.com/stackblitz/tutorialkit/issues/233)) ([9bf2156](https://github.com/stackblitz/tutorialkit/commit/9bf2156df26656427482645d3d134127863de233))



## [0.1.4](https://github.com/stackblitz/tutorialkit/compare/0.1.3...0.1.4) (2024-08-08)


### Bug Fixes

* **astro:** sub folders not working on Windows ([#225](https://github.com/stackblitz/tutorialkit/issues/225)) ([694f5ca](https://github.com/stackblitz/tutorialkit/commit/694f5ca26dafae33554136ffbedea70c6c87585c))
* **astro:** webcontainers link to be in plural ([#227](https://github.com/stackblitz/tutorialkit/issues/227)) ([0b86ebd](https://github.com/stackblitz/tutorialkit/commit/0b86ebd4e6e2b28dd2ef0ff97a5c66f9eb780973))


### Features

* **extension:** support config-based ordering ([#223](https://github.com/stackblitz/tutorialkit/issues/223)) ([3b2c776](https://github.com/stackblitz/tutorialkit/commit/3b2c7763a9af488bf32586708b2af328256e0c41))



## [0.1.3](https://github.com/stackblitz/tutorialkit/compare/0.1.2...0.1.3) (2024-08-07)


### Features

* add 'Open in StackBlitz'-button ([#219](https://github.com/stackblitz/tutorialkit/issues/219)) ([af428c8](https://github.com/stackblitz/tutorialkit/commit/af428c84f0cd817debd336dc43e88c19583800ce))
* add link to webcontainers.io ([#202](https://github.com/stackblitz/tutorialkit/issues/202)) ([70d20c7](https://github.com/stackblitz/tutorialkit/commit/70d20c7b3801b458aa11c7d70a11ea1392d0fa60))
* add Svelte language to CodeMirror ([#212](https://github.com/stackblitz/tutorialkit/issues/212)) ([359c0e0](https://github.com/stackblitz/tutorialkit/commit/359c0e05c91c437066ff9a19a61bb74365faf3f0))
* rename `tutorialkit` to `@tutorialkit/cli` ([#153](https://github.com/stackblitz/tutorialkit/issues/153)) ([2986157](https://github.com/stackblitz/tutorialkit/commit/298615748b1f2d3ea737c591ce193eb0d28407ca))



## [0.1.2](https://github.com/stackblitz/tutorialkit/compare/0.1.1...0.1.2) (2024-08-01)


### Bug Fixes

* ignore templates `node_modules` ([#198](https://github.com/stackblitz/tutorialkit/issues/198)) ([d7215ca](https://github.com/stackblitz/tutorialkit/commit/d7215ca2a080267a3cc2c660dc997665d2fcfc26))



## [0.1.1](https://github.com/stackblitz/tutorialkit/compare/0.1.0...0.1.1) (2024-07-30)


### Bug Fixes

* **cli:** normalize windows paths for `fast-glob` ([#184](https://github.com/stackblitz/tutorialkit/issues/184)) ([eaa9890](https://github.com/stackblitz/tutorialkit/commit/eaa9890da93169ec2e3249a6065501a1326b4df9))



# [0.1.0](https://github.com/stackblitz/tutorialkit/compare/0.0.3...0.1.0) (2024-07-25)


### Bug Fixes

* **cli:** remove vs code `settings.json` ([#173](https://github.com/stackblitz/tutorialkit/issues/173)) ([8dde2c3](https://github.com/stackblitz/tutorialkit/commit/8dde2c3248fe897921c1e928f5084c426270ede2))
* **docs:** jumping to bottom of getting started page ([#170](https://github.com/stackblitz/tutorialkit/issues/170)) ([55430f9](https://github.com/stackblitz/tutorialkit/commit/55430f9006427e9435e9ce7d1be62315c6575e2b))
* solve shows lesson-only files empty ([#168](https://github.com/stackblitz/tutorialkit/issues/168)) ([bbb13f7](https://github.com/stackblitz/tutorialkit/commit/bbb13f7251a5259a3f7b4fc8300d0b308828bd73))


### Features

* add `contentSchema` ([#156](https://github.com/stackblitz/tutorialkit/issues/156)) ([bc0fde2](https://github.com/stackblitz/tutorialkit/commit/bc0fde26025465f5ab1fa71613d92293f0dafa89))
* **cli:** add vs code extension to recommendations ([#172](https://github.com/stackblitz/tutorialkit/issues/172)) ([f6fd489](https://github.com/stackblitz/tutorialkit/commit/f6fd48986c4760447c11743174c3448b9b733c4f))
* **extension:** metadata autocompletion ([#143](https://github.com/stackblitz/tutorialkit/issues/143)) ([be0a096](https://github.com/stackblitz/tutorialkit/commit/be0a0965bbd7b553bc6b5b1f4019e22ee0651d30))



## [0.0.3](https://github.com/stackblitz/tutorialkit/compare/0.0.2...0.0.3) (2024-07-23)


### Bug Fixes

* **deps:** update `astro` for Node 18.18 compatibility ([#159](https://github.com/stackblitz/tutorialkit/issues/159)) ([4b50335](https://github.com/stackblitz/tutorialkit/commit/4b50335d284fd22d38d9dab2c0f85e219533a9e5))



## [0.0.2](https://github.com/stackblitz/tutorialkit/compare/0.0.1...0.0.2) (2024-07-17)



## [0.0.1](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.26...0.0.1) (2024-07-17)


### Bug Fixes

* a transition-theme class was missing for the content right border ([#139](https://github.com/stackblitz/tutorialkit/issues/139)) ([c75ef40](https://github.com/stackblitz/tutorialkit/commit/c75ef4089833b8974c2b0877535f1967065ef08a))
* **ci:** override @astrojs/language-server with an older version ([#145](https://github.com/stackblitz/tutorialkit/issues/145)) ([bf9119e](https://github.com/stackblitz/tutorialkit/commit/bf9119ef29913eadd66581a103c3b34d9bf58401))
* **extension:** setup CI and minor improvements ([#142](https://github.com/stackblitz/tutorialkit/issues/142)) ([5a1f108](https://github.com/stackblitz/tutorialkit/commit/5a1f1084d018de789eb563c5959f557658963168))


### Features

* add vscode extension ([#109](https://github.com/stackblitz/tutorialkit/issues/109)) ([33a69f9](https://github.com/stackblitz/tutorialkit/commit/33a69f9de5d163029b78133b129147ff23a6de0b))



## [0.0.1-alpha.26](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.25...0.0.1-alpha.26) (2024-07-15)


### Bug Fixes

* **ci:** use PAT to make sure release PRs trigger workflows ([#124](https://github.com/stackblitz/tutorialkit/issues/124)) ([5e1a8bc](https://github.com/stackblitz/tutorialkit/commit/5e1a8bc4a9a569b27da787cfa5459723321b45f7))
* mobile fixes and basic i18n support ([#127](https://github.com/stackblitz/tutorialkit/issues/127)) ([f85e8eb](https://github.com/stackblitz/tutorialkit/commit/f85e8eb6058473b0ad2e061d39e14d111f3f34fe))


### Features

* add "Edit this page" link ([#130](https://github.com/stackblitz/tutorialkit/issues/130)) ([dd9c52c](https://github.com/stackblitz/tutorialkit/commit/dd9c52c6f1d3c90cc1d993d8c0fec61dadfc5815))
* finalize basic i18n support ([#133](https://github.com/stackblitz/tutorialkit/issues/133)) ([09d8bf7](https://github.com/stackblitz/tutorialkit/commit/09d8bf7bd7673abb5b92b7de569daad1b44b07fd))



## [0.0.1-alpha.25](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.24...0.0.1-alpha.25) (2024-07-09)


### Bug Fixes

* tag should be the version without the 'v' ([#121](https://github.com/stackblitz/tutorialkit/issues/121)) ([d292d0b](https://github.com/stackblitz/tutorialkit/commit/d292d0b01b0f668a098c20d63bf819077574d31e))


### Features

* `tutorialkit eject` command ([#81](https://github.com/stackblitz/tutorialkit/issues/81)) ([c802668](https://github.com/stackblitz/tutorialkit/commit/c802668aa39875052ac917952bee8d491dde1557))
* support overriding `TopBar` ([#112](https://github.com/stackblitz/tutorialkit/issues/112)) ([3792aa9](https://github.com/stackblitz/tutorialkit/commit/3792aa99103ed2461c9b4922838fec7fbcb5dec7))



## [0.0.1-alpha.24](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.23...0.0.1-alpha.24) (2024-07-04)

Special thanks to [@leonyoung1](https://github.com/leonyoung1) for their first contribution!! 🥳

### Bug Fixes

* **cli:** remove title from tutorial meta file ([#86](https://github.com/stackblitz/tutorialkit/issues/86)) ([c2f7688](https://github.com/stackblitz/tutorialkit/commit/c2f7688b27074c6261f025525437bccea9431fd3))
* editor ignoring changes ([#102](https://github.com/stackblitz/tutorialkit/issues/102)) ([0f01e31](https://github.com/stackblitz/tutorialkit/commit/0f01e317d449761fb7da8291119e57bd1d934e79))
* generate correct changelogs when doing a PR ([#113](https://github.com/stackblitz/tutorialkit/issues/113)) ([8b8b1ca](https://github.com/stackblitz/tutorialkit/commit/8b8b1caea8793748d9946e163a184a3ecb958358))
* problem with creating lessons without solution files ([#108](https://github.com/stackblitz/tutorialkit/issues/108)) ([2d51ff7](https://github.com/stackblitz/tutorialkit/commit/2d51ff713688e34cf3e6140ff4ac4df2a574f6a4))
* support a base different from / in astro config ([#92](https://github.com/stackblitz/tutorialkit/issues/92)) ([3e7830b](https://github.com/stackblitz/tutorialkit/commit/3e7830be7ed1fda9598c569eaad9878aa9d10156))
* **theme:** fix some styling for the editor ([#100](https://github.com/stackblitz/tutorialkit/issues/100)) ([0f5dd45](https://github.com/stackblitz/tutorialkit/commit/0f5dd4540cf65535ce3b834846f7dd2029551987))
* **theme:** invalid CSS variable on cm-gutter ([#98](https://github.com/stackblitz/tutorialkit/issues/98)) ([039f871](https://github.com/stackblitz/tutorialkit/commit/039f8714df8401a81472d134786029212c7d0d44))
* **theme:** set correct background and text color for panels ([#94](https://github.com/stackblitz/tutorialkit/issues/94)) ([3ad01a0](https://github.com/stackblitz/tutorialkit/commit/3ad01a0cc1055c1f1ffd7b220785f4be1d8d0669))
* **theme:** use correct tokens for the breadcrumbs ([#88](https://github.com/stackblitz/tutorialkit/issues/88)) ([1669299](https://github.com/stackblitz/tutorialkit/commit/1669299c988b8680dda4360e8f02d64c601ad48d))
* update `pnpm/action-setup` to v4 to fix CI issue ([#114](https://github.com/stackblitz/tutorialkit/issues/114)) ([e36c455](https://github.com/stackblitz/tutorialkit/commit/e36c455a783b5f79c9f321b865eedcd215bcf107))


### Features

* add `@tutorialkit/theme` package to use the theme without astro ([#105](https://github.com/stackblitz/tutorialkit/issues/105)) ([9805996](https://github.com/stackblitz/tutorialkit/commit/9805996a4211a1c8a3e1bfbbd958a27f1957d4d7))
* add eslint ([#90](https://github.com/stackblitz/tutorialkit/issues/90)) ([fcfb3e8](https://github.com/stackblitz/tutorialkit/commit/fcfb3e8109b5be1ef59ac2bfd8efd4db8e635e34))
* allow custom `src/pages/index.astro` ([#93](https://github.com/stackblitz/tutorialkit/issues/93)) ([d431d4d](https://github.com/stackblitz/tutorialkit/commit/d431d4d4908f28184cd7d2f75faffe2c77a3ef4c))
* allow ordering to be config based in addition to folder based ([#79](https://github.com/stackblitz/tutorialkit/issues/79)) ([2b131e5](https://github.com/stackblitz/tutorialkit/commit/2b131e597b94671678c2f2e4625e194eb382dab0))
* make core react components easily accessible ([#104](https://github.com/stackblitz/tutorialkit/issues/104)) ([d8a5a34](https://github.com/stackblitz/tutorialkit/commit/d8a5a341df6c2d23d1d59ede61b4d3ef689af081))
* make the logo link configurable ([#68](https://github.com/stackblitz/tutorialkit/issues/68)) ([2da64ae](https://github.com/stackblitz/tutorialkit/commit/2da64ae811cbb12aeab8fd1fb36bed4845542aa4))
* mobile support ([#91](https://github.com/stackblitz/tutorialkit/issues/91)) ([030ca1e](https://github.com/stackblitz/tutorialkit/commit/030ca1ee688f75f6e59ae25a1b2433823ade384f))
* template inheritance ([#99](https://github.com/stackblitz/tutorialkit/issues/99)) ([c4350a8](https://github.com/stackblitz/tutorialkit/commit/c4350a8032d0d24ac9250be8b81869ddae88a538))
* **terminal:** add support for redirects and allow specific commands ([#76](https://github.com/stackblitz/tutorialkit/issues/76)) ([eca5f22](https://github.com/stackblitz/tutorialkit/commit/eca5f22e3120c4d59349f416322b990d37cb0c15))
* **theme:** add support for setting text and code colors in callouts ([#96](https://github.com/stackblitz/tutorialkit/issues/96)) ([623b04d](https://github.com/stackblitz/tutorialkit/commit/623b04da18e5545a6d29b03a60571b1fb5bc2db1))
* **theme:** create proper tokens for callouts ([#87](https://github.com/stackblitz/tutorialkit/issues/87)) ([6d01620](https://github.com/stackblitz/tutorialkit/commit/6d01620f65c2386d98864246f8fe87e53c76c78f))



## [0.0.1-alpha.23](https://github.com/stackblitz/tutorialkit/compare/0.0.1-alpha.22...0.0.1-alpha.23) (2024-06-14)

Special thanks to @EmNudge and @morinokami for their first contributions!! 🥳

### Bug Fixes

* feature request issue template ([cc8423a](https://github.com/stackblitz/tutorialkit/commit/cc8423abe2c613f82d73179ca82f39e4ac0929c9))
* generate root changelog + changelog per package ([24d4131](https://github.com/stackblitz/tutorialkit/commit/24d4131ff5ffca9fde614cb3dd7682d6eca60433))
* hydration error after runtime refactor ([#63](https://github.com/stackblitz/tutorialkit/issues/63)) ([8f90338](https://github.com/stackblitz/tutorialkit/commit/8f9033816cd122be49ade2b85e0040469ed9fb1c))
* ignore platform specific files ([#69](https://github.com/stackblitz/tutorialkit/issues/69)) ([186e2db](https://github.com/stackblitz/tutorialkit/commit/186e2dba86b529fcc5816861e689edf128f520e2))
* **logo:** support multiple formats and remove styling requirements ([#62](https://github.com/stackblitz/tutorialkit/issues/62)) ([79cb18d](https://github.com/stackblitz/tutorialkit/commit/79cb18dca4e6b80a1f12ec96e1e627678f7b377d))
* **nav:** make sure nav is on top of the content ([#72](https://github.com/stackblitz/tutorialkit/issues/72)) ([cd4ecc7](https://github.com/stackblitz/tutorialkit/commit/cd4ecc756dde3d2d74326154c7ba700c967f8b97))
* sort navigation items numerically in `objectToSortedArray` function ([#56](https://github.com/stackblitz/tutorialkit/issues/56)) ([e45f62b](https://github.com/stackblitz/tutorialkit/commit/e45f62b68952228dd1facd55c2db5bd9f5247e42))
* support inheritance for `editor`/`focus` and fix bug with logo ([#67](https://github.com/stackblitz/tutorialkit/issues/67)) ([a7eb31d](https://github.com/stackblitz/tutorialkit/commit/a7eb31dcaa039292870a78fae979efd6c0ece134))
* **validation:** allow activePanel to be 0 ([#46](https://github.com/stackblitz/tutorialkit/issues/46)) ([4ab76f5](https://github.com/stackblitz/tutorialkit/commit/4ab76f54e94dd7d47400ae558257f23763919ea9))


### Features

* add create-tutorial package ([#47](https://github.com/stackblitz/tutorialkit/issues/47)) ([e720657](https://github.com/stackblitz/tutorialkit/commit/e7206578ac29212cab211f988ea2c8f7dcbe00d1))
* add lezer support for wast via codemirror wast package ([#65](https://github.com/stackblitz/tutorialkit/issues/65)) ([0ce2986](https://github.com/stackblitz/tutorialkit/commit/0ce2986077a5c8384a7f118bab9d8820ff707c72))
* add MDX extension to `recommendations` in extensions.json ([#55](https://github.com/stackblitz/tutorialkit/issues/55)) ([2d0a1fa](https://github.com/stackblitz/tutorialkit/commit/2d0a1fafab4d65236e196fe101e26535a24b3105))
* allow custom components that modify the tutorial state ([#64](https://github.com/stackblitz/tutorialkit/issues/64)) ([1279917](https://github.com/stackblitz/tutorialkit/commit/1279917be042580033f23605e92f903ecd186e19))
* hot reload for files in webcontainer ([#61](https://github.com/stackblitz/tutorialkit/issues/61)) ([949fcf3](https://github.com/stackblitz/tutorialkit/commit/949fcf3438e3bf17902d753089372fbc03911136))
* set default package manager to the one used with `create` command ([#57](https://github.com/stackblitz/tutorialkit/issues/57)) ([c97278e](https://github.com/stackblitz/tutorialkit/commit/c97278e94292a2f4cfd76a75cb31e540b5c0d230))
* **store:** fix current document and add onDocumentChanged ([#74](https://github.com/stackblitz/tutorialkit/issues/74)) ([05b1688](https://github.com/stackblitz/tutorialkit/commit/05b1688718ab6e8d7d55c09e892c7f1faef9116e))



