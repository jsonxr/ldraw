import { distinct } from '../../src/utils/distinct';

describe('utils/distinct', () => {
  it('should return only unique strings', () => {
    const list = ['a', 'a', 'b'];
    expect(list.filter(distinct)).toEqual(['a', 'b']);
  });

  it('should do a shallow comparison ', () => {
    const list = [{ o: 'a' }, { o: 'a' }, { o: 'b' }];
    expect(list.filter(distinct)).toEqual(list);
  });
});
