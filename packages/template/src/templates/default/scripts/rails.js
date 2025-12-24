import path from 'node:path';
import { runRails } from '@tutorialkit-rb/rails-wasm/scripts';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const railsRootDir = path.join(__dirname, '../workspace/store');

try {
  await runRails(process.argv.slice(2), {
    railsRootDir,
    env: {
      PATH: '/home/tutorial/bin:/bin:/usr/bin:/usr/local/bin',
    },
  });
} catch (error) {
  console.error('Rails script failed:', error.message);
  process.exit(1);
}
