import fs from 'node:fs';
import path from 'node:path';
import * as prompts from '@clack/prompts';
import chalk from 'chalk';
import yargs from 'yargs-parser';
import { pkg } from '../../pkg.js';
import { errorLabel, primaryLabel, printHelp } from '../../utils/messages.js';
import { generateProjectName } from '../../utils/project.js';
import { assertNotCanceled } from '../../utils/tasks.js';
import { updateWorkspaceVersions } from '../../utils/workspace-version.js';
import { setupEnterpriseConfig } from './enterprise.js';
import { promptGemfileEditing, printRubyNextSteps } from './gemfile-editing.js';
import { generateHostingConfig } from './generate-hosting-config.js';
import { initGitRepo } from './git.js';
import { DEFAULT_VALUES, type CreateOptions } from './options.js';
import { selectPackageManager, type PackageManager } from './package-manager.js';
import { copyTemplate } from './template.js';

const TUTORIALKIT_VERSION = pkg.version;

export async function createTutorial(flags: yargs.Arguments) {
  if (flags._[1] === 'help' || flags.help || flags.h) {
    printHelp({
      commandName: `${pkg.name} create`,
      usage: '[name] [...options]',
      tables: {
        Options: [
          ['--dir, -d', 'The folder in which the tutorial gets created'],
          ['--git, --no-git', `Initialize a local git repository (default ${chalk.yellow(DEFAULT_VALUES.git)})`],
          [
            '--provider <name>, --no-provider',
            `Select a hosting provider (default ${chalk.yellow(DEFAULT_VALUES.provider)})`,
          ],
          ['--dry-run', `Walk through steps without executing (default ${chalk.yellow(DEFAULT_VALUES.dryRun)})`],
          [
            '--package-manager <name>, -p <name>',
            `The package used to install dependencies (default ${chalk.yellow(DEFAULT_VALUES.packageManager)})`,
          ],
          [
            '--enterprise <origin>, -e <origin>',
            `The origin of your StackBlitz Enterprise instance (if not provided authentication is not turned on and your project will use ${chalk.yellow('https://stackblitz.com')})`,
          ],
          [
            '--force',
            `Overwrite existing files in the target directory without prompting (default ${chalk.yellow(DEFAULT_VALUES.force)})`,
          ],
          ['--defaults', 'Skip all prompts and initialize the tutorial using the defaults'],
        ],
      },
    });

    return 0;
  }

  applyAliases(flags);

  try {
    return _createTutorial(flags);
  } catch (error) {
    console.error(`${errorLabel()} Command failed`);

    if (error.stack) {
      console.error(`\n${error.stack}`);
    }

    process.exit(1);
  }
}

async function _createTutorial(flags: CreateOptions): Promise<undefined> {
  prompts.intro(primaryLabel(pkg.name));

  let tutorialName = flags._[1] !== undefined ? String(flags._[1]) : undefined;

  if (tutorialName === undefined) {
    const randomName = generateProjectName();

    if (flags.defaults) {
      tutorialName = randomName;
    } else {
      const answer = await prompts.text({
        message: `What's the name of your tutorial?`,
        placeholder: randomName,
        validate: (value) => {
          if (!value) {
            return 'Please provide a name!';
          }

          return undefined;
        },
      });

      assertNotCanceled(answer);

      tutorialName = answer;
    }
  }

  prompts.log.info(`We'll call your tutorial ${chalk.blue(tutorialName)}`);

  const dest = await getTutorialDirectory(tutorialName, flags);
  const resolvedDest = path.resolve(process.cwd(), dest);

  prompts.log.info(`Scaffolding tutorial in ${chalk.blue(resolvedDest)}`);

  if (fs.existsSync(resolvedDest) && !flags.force) {
    if (flags.defaults) {
      console.error(`\n${errorLabel()} Failed to create tutorial. Directory already exists.`);
      process.exit(1);
    }

    let answer: boolean | symbol;

    if (fs.readdirSync(resolvedDest).length > 0) {
      answer = await prompts.confirm({
        message: `Directory is not empty. Continuing may overwrite existing files. Do you want to continue?`,
        initialValue: false,
      });
    } else {
      answer = await prompts.confirm({
        message: `Directory already exists. Continuing may overwrite existing files. Do you want to continue?`,
        initialValue: false,
      });
    }

    assertNotCanceled(answer);

    if (!answer) {
      exitEarly();
    }
  } else {
    if (!flags.dryRun) {
      // ensure destination exists
      fs.mkdirSync(resolvedDest, { recursive: true });
    }
  }

  await copyTemplate(resolvedDest, flags);

  const provider = await generateHostingConfig(resolvedDest, flags);

  updatePackageJson(resolvedDest, tutorialName, flags, provider);

  const selectedPackageManager = await selectPackageManager(resolvedDest, flags);

  updateReadme(resolvedDest, selectedPackageManager, flags);

  await setupEnterpriseConfig(resolvedDest, flags);

  await initGitRepo(resolvedDest, flags);

  prompts.log.success(chalk.green('Tutorial successfully created!'));

  await promptGemfileEditing(dest, flags);

  printRubyNextSteps(dest);

  prompts.outro(`You're all set!`);

  console.log('Until next time 👋');
}

async function getTutorialDirectory(tutorialName: string, flags: CreateOptions) {
  const dir = flags.dir;

  if (dir) {
    return dir;
  }

  if (flags.defaults) {
    return `./${tutorialName}`;
  }

  const promptResult = await prompts.text({
    message: 'Where should we create your new tutorial?',
    initialValue: `./${tutorialName}`,
    placeholder: './',
    validate(value) {
      if (!path.isAbsolute(value) && !value.startsWith('./')) {
        return 'Please provide an absolute or relative path!';
      }

      return undefined;
    },
  });

  assertNotCanceled(promptResult);

  return promptResult;
}

function updatePackageJson(dest: string, projectName: string, flags: CreateOptions, provider: string) {
  if (flags.dryRun) {
    return;
  }

  const pkgPath = path.resolve(dest, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  pkgJson.name = projectName;

  updateWorkspaceVersions(pkgJson.dependencies, TUTORIALKIT_VERSION);
  updateWorkspaceVersions(pkgJson.devDependencies, TUTORIALKIT_VERSION);

  if (provider.toLowerCase() === 'cloudflare') {
    pkgJson.scripts = pkgJson.scripts || {};
    pkgJson.scripts.postbuild = 'cp _headers ./dist/';
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));

  try {
    const pkgLockPath = path.resolve(dest, 'package-lock.json');
    const pkgLockJson = JSON.parse(fs.readFileSync(pkgLockPath, 'utf8'));
    const defaultPackage = pkgLockJson.packages[''];

    pkgLockJson.name = projectName;

    if (defaultPackage) {
      defaultPackage.name = projectName;
    }

    fs.writeFileSync(pkgLockPath, JSON.stringify(pkgLockJson, null, 2));
  } catch {
    // ignore any errors
  }
}

function updateReadme(dest: string, packageManager: PackageManager, flags: CreateOptions) {
  if (flags.dryRun) {
    return;
  }

  const readmePath = path.resolve(dest, 'README.md');

  let readme = fs.readFileSync(readmePath, 'utf8');

  // update placeholder for package manager
  readme = readme.replaceAll('<% pkgManager %>', packageManager ?? DEFAULT_VALUES.packageManager);

  fs.writeFileSync(readmePath, readme);
}

function exitEarly(exitCode = 0): never {
  prompts.outro('Until next time!');
  process.exit(exitCode);
}

function applyAliases(flags: CreateOptions & Record<string, any>) {
  if (flags.d) {
    flags.dir = flags.d;
  }

  if (flags.p) {
    flags.packageManager = flags.p;
  }

  if (flags.e) {
    flags.enterprise = flags.e;
  }
}
