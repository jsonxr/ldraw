import { parse } from '../../src/parser/parse';

describe('0 FILE', () => {
  it('should parse a file inside an mpd', () => {
    const str = `
      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files![0].name).toEqual('model1.ldr');
  });
});
