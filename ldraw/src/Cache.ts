export class Cache<T> {
  public list: Record<string, T> = {};

  public has = (key: string): boolean => {
    return this.list[key.toLowerCase()] !== undefined;
  };

  public set = (key: string, value: T): void => {
    this.list[key.toLowerCase()] = value;
  };

  public get = async (
    key: string,
    fn?: () => Promise<T | null>
  ): Promise<T | null> => {
    let value: T | null = this.list[key.toLowerCase()] ?? null;
    if (!value && fn) {
      value = await fn();
      if (value !== null) {
        this.set(key.toLowerCase(), value);
      }
    }
    return value;
  };
}
