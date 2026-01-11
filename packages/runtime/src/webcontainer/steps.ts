import { atom, computed } from 'nanostores';
import type { Command } from './command.js';

export type Steps = Step[];

export interface Step {
  title: string;
  status: 'completed' | 'running' | 'failed' | 'skipped' | 'idle';
}

export class StepsController {
  /**
   * Steps that the runner is or will be executing.
   */
  steps = atom<Steps | undefined>(undefined);

  /**
   * Number of prepare commands that should block terminal input.
   * If undefined, terminal is not blocked during prepare commands.
   */
  private _blockingCount = atom<number | undefined>(undefined);

  /**
   * Whether the environment is being prepared (blocking prepare commands are running).
   * This is true when any of the first N prepare commands (where N = terminalBlockingPrepareCommandsCount)
   * has status 'idle' or 'running'. Used to block terminal input during npm install and similar setup commands.
   */
  isPreparing = computed(
    [this.steps, this._blockingCount],
    (steps: Steps | undefined, blockingCount: number | undefined) => {
      // if no blocking count is set, terminal is never blocked
      if (blockingCount === undefined || blockingCount === 0) {
        return false;
      }

      if (!steps || steps.length === 0) {
        return false;
      }

      // only check the first N steps where N is the blocking count
      const blockingSteps = steps.slice(0, blockingCount);

      // environment is preparing if any blocking step is idle or running
      return blockingSteps.some((step) => step.status === 'idle' || step.status === 'running');
    },
  );

  /**
   * Set the number of prepare commands that should block terminal input.
   */
  setBlockingCount(count: number | undefined) {
    this._blockingCount.set(count);
  }

  setFromCommands(commands: Command[]) {
    if (commands.length > 0) {
      this.steps.set(
        commands.map((command) => ({
          title: command.title,
          status: 'idle',
        })),
      );
    } else {
      this.steps.set(undefined);
    }
  }

  updateStep(index: number, step: Step) {
    const currentSteps = this.steps.value;

    if (!currentSteps) {
      return;
    }

    this.steps.set([...currentSteps.slice(0, index), step, ...currentSteps.slice(index + 1)]);
  }

  skipRemaining(index: number) {
    const currentSteps = this.steps.value;

    if (!currentSteps) {
      return;
    }

    this.steps.set([
      ...currentSteps.slice(0, index),
      ...currentSteps.slice(index).map((step) => ({
        ...step,
        status: 'skipped' as const,
      })),
    ]);
  }
}
