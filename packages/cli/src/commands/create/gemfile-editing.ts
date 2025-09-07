import path from 'node:path';
import * as prompts from '@clack/prompts';
import chalk from 'chalk';
import { execa } from 'execa';
import { assertNotCanceled } from '../../utils/tasks.js';
import { type CreateOptions } from './options.js';

export async function promptGemfileEditing(dest: string, flags: CreateOptions) {
  if (flags.defaults || flags.dryRun) {
    return false; // skip Gemfile editing in defaults/dry-run mode
  }

  prompts.log.message(chalk.bold.underline('Ruby Gems Configuration'));

  prompts.log.info(`Your Ruby application's gems are configured in ${chalk.blue('ruby-wasm/Gemfile')}`);

  const answer = await prompts.confirm({
    message: 'Would you like to edit the Gemfile to add additional gems?',
    initialValue: true,
  });

  assertNotCanceled(answer);

  if (answer) {
    const gemfilePath = path.resolve(dest, 'ruby-wasm/Gemfile');
    const editor = process.env.EDITOR;

    if (editor) {
      prompts.log.message('');
      prompts.log.info(`Opening ${chalk.blue('ruby-wasm/Gemfile')} in your editor...`);

      try {
        await execa(editor, [gemfilePath], { stdio: 'inherit' });
        prompts.log.success('Great! Your Gemfile has been configured.');

        return true;
      } catch (error) {
        prompts.log.warn(`Failed to open editor: ${error.message}`);
        prompts.log.info('Falling back to manual editing instructions...');
      }
    }

    // manual editing instructions (fallback or when EDITOR is not set)
    prompts.log.message('');
    prompts.log.step(`1. Open ${chalk.blue(gemfilePath)} in your editor`);
    prompts.log.step(`2. Add any additional gems you need for your tutorial`);
    prompts.log.step(`3. Save the file and return here`);
    prompts.log.message('');

    const ready = await prompts.confirm({
      message: 'Have you finished editing the Gemfile?',
      initialValue: true,
    });

    assertNotCanceled(ready);

    if (ready) {
      prompts.log.success('Great! Your Gemfile has been configured.');
      return true;
    }
  }

  return false;
}

export function printRubyNextSteps(dest: string) {
  let i = 0;

  prompts.log.message(chalk.bold.underline('Next Steps'));

  const steps = [
    [`cd ${dest}`, 'Navigate to project'],
    ['npm run build:wasm', 'Build Ruby WebAssembly with your gems'],
    ['npm run dev', 'Start development server'],
    [, `Head over to ${chalk.underline('http://localhost:4321')}`],
  ];

  for (const [command, text] of steps) {
    i++;
    prompts.log.step(`${i}. ${command ? `${chalk.blue(command)} - ` : ''}${text}`);
  }

  prompts.log.message('');
  prompts.log.info('💡 The WASM build step may take several minutes the first time.');
  prompts.log.info('💡 Subsequent builds will be faster thanks to caching.');
}
