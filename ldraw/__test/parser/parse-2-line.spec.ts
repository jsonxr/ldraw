import { parse } from '../../src/parser/parse';

describe('"2" - line', () => {
  it('should add a line', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      2 16 1 2 3 4 5 6
      `.trim();
    const parsed = parse(str);
    expect(parsed).toBeTruthy();
    const line = parsed!.files[0].lines[0];
    expect(line).toBeTruthy();
    expect(line.colour).toEqual(16);
    expect(line.x1).toEqual(1);
    expect(line.y1).toEqual(2);
    expect(line.z1).toEqual(3);
    expect(line.x2).toEqual(4);
    expect(line.y2).toEqual(5);
    expect(line.z2).toEqual(6);
  });
});
