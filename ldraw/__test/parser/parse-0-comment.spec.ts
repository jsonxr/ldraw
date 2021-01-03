import { parse } from '../../src/parser/parse';

describe('0 //', () => {
  it('should parse a comment after the header', () => {
    const str = `
    0 model1.ldr
    0 Name: model1.ldr
    0 Author: Part Author [theauthor]
    0 !LDRAW_ORG Model
    0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    0 // My comment
    `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].commands.length).toEqual(8);
  });
});
