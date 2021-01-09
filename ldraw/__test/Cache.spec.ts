import { Cache } from '../src/shared/Cache';

describe('Cache', () => {
  let cache: Cache<string>;
  beforeEach(() => {
    cache = new Cache<string>();
    cache.set('yes', 'yes');
  });
  describe('new Cache()', () => {
    it('should instantiate', () => {
      expect(cache).toBeTruthy();
    });
  });
  describe('has', () => {
    it('should return false if value does not exist in cache', () => {
      expect(cache.has('no')).toBeFalsy();
    });
    it('should return true if value exists in cache', () => {
      expect(cache.has('yes')).toBeTruthy();
    });
  });
  describe('get', () => {
    it('should return an object if it exists in cache', async () => {
      const fn = jest.fn().mockResolvedValue('hi');
      expect(await cache.get('yes', fn)).toEqual('yes');
      expect(fn).not.toHaveBeenCalled();
    });
    it('should return null if object does not exist in cache', async () => {
      expect(await cache.get('no')).toBeNull();
    });
    it('should call function and cache result if object does not exist in cache', async () => {
      const fn = jest.fn().mockResolvedValue('');
      expect(await cache.get('hi', fn)).toEqual('');
      expect(cache.has('hi')).toBeTruthy();
      expect(fn).toHaveBeenCalled();
    });
    it('should call function but not cache result if object returned is null', async () => {
      const fn = jest.fn().mockResolvedValue(null);
      expect(await cache.get('hi', fn)).toBeNull();
      expect(fn).toHaveBeenCalled();
      expect(await cache.get('hi', fn)).toBeFalsy();
    });
  });
});
