/**
 * Boot progress reporting for Rails WASM initialization.
 * Allows consumers to track the boot sequence stages.
 */

export class BootProgress {
  constructor() {
    this.listeners = new Set();
    this.currentStep = "Initializing...";
    this.currentValue = 0;
  }

  addListener(listener) {
    this.listeners.add(listener);
    listener({ step: this.currentStep, value: this.currentValue });
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  updateStep(step) {
    this.currentStep = step;
    this.currentValue = 0;
    this.notifyListeners();
  }

  updateProgress(value) {
    this.currentValue = Math.min(100, Math.max(0, value));
    this.notifyListeners();
  }

  notifyListeners() {
    const state = { step: this.currentStep, value: this.currentValue };
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (e) {
        console.error("Boot progress listener error:", e);
      }
    }
  }

  log(message) {
    console.log(`[boot] ${message}`);
  }
}

export const bootProgress = new BootProgress();
