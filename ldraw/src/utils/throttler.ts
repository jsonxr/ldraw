import { delay } from './delay';

export const throttler = (throttle = 0): (() => Promise<void>) => {
  let _lastTime = 0;

  // Used for throttling
  return async () => {
    const currentTime = Date.now();
    const ms = _lastTime + throttle - currentTime;
    if (ms > 0) {
      _lastTime = currentTime + ms;
      await delay(ms);
    } else {
      _lastTime = currentTime;
    }
  };
};
