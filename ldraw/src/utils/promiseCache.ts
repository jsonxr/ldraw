import { throttler } from './throttler';
import { DelayedPromise } from './DelayedPromise';

export interface PromiseCache<T> {
  (key: string, fn: () => Promise<T>): Promise<T>;
  set: (key: string, promise: Promise<T> | T) => void;
  list(): Record<string, T>;
}

export function promiseCache<T>({
  limit = 6,
  throttle = 0,
}: { name?: string; limit?: number; throttle?: number } = {}): PromiseCache<T> {
  const _promises: Record<string, Promise<T>> = {};
  const _queue: DelayedPromise<T>[] = [];
  const _throttle = throttler(throttle);
  const _list: Record<string, T> = {};
  let _count = 0;

  const process = () => {
    while (_count < limit && _queue.length) {
      const fn = _queue.shift();
      if (fn) {
        fn.execute();
      }
    }
  };

  const get = (key: string): Promise<T> | undefined =>
    _promises[key.toLowerCase()];

  const set = (key: string, promise: Promise<T> | T): void => {
    if (get(key)) {
      throw new Error(`${key} already exists in promiseCache`);
    }
    if (promise instanceof Promise) {
      _promises[key.toLowerCase()] = promise;
    } else {
      _promises[key.toLowerCase()] = Promise.resolve(promise);
    }
  };

  const promiseFn = (key: string, fn: () => Promise<T>): Promise<T> => {
    // first check our promises, if we find one, return it...
    let promise = get(key);
    if (!promise) {
      //promise = addPromiseFn(key, fn);
      const delayedPromise = new DelayedPromise<T>(async (resolve, reject) => {
        _count++;
        await _throttle();
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          reject(err);
        }
        _count--;
        process();
      });
      //delayedPromise.execute();
      _queue.push(delayedPromise);
      promise = delayedPromise;
      _promises[key] = promise;
    }
    process();
    return promise;
  };
  promiseFn.set = set;
  promiseFn.list = () => _list;

  return promiseFn;
}
