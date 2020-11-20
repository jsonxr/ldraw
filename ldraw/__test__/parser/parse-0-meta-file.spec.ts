import { parse } from '../../src/parser/parse';
import { singleFile } from '../test-utils';
describe('0 FILE', () => {
  it('should parse a file inside an mpd', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}
  `);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files![0].name).toEqual('model1.ldr');
  });
});
