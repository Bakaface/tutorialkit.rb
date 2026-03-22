import { atom } from 'nanostores';

function getActivateText(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = new URLSearchParams(window.location.search).get('activate');

  if (value === null || value === '') {
    return null;
  }

  return value;
}

export const activateText = getActivateText();
export const isDeferred = activateText !== null;
export const isActivated = atom<boolean>(!isDeferred);

let _resolveActivation: (() => void) | undefined;

export const activationPromise: Promise<void> = isDeferred
  ? new Promise<void>((resolve) => {
      _resolveActivation = resolve;
    })
  : Promise.resolve();

export function activate() {
  isActivated.set(true);
  _resolveActivation?.();
}
