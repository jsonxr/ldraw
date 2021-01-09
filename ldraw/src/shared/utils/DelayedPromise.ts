export class DelayedPromise<T> implements Promise<T> {
  [Symbol.toStringTag]: string;

  private executor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private resolve: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reject: any;
  private promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
  then = this.promise.then.bind(this.promise);
  catch = this.promise.catch.bind(this.promise);
  finally = this.promise.finally.bind(this.promise);

  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reject: (reason?: any) => void
    ) => void
  ) {
    this.executor = executor;
  }

  execute(): Promise<T> {
    this.executor(this.resolve, this.reject);
    return this.promise;
  }
}
