import { parse } from '../../src/parser/parse';

describe('"4" - quad', () => {
  it('should add a quad', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      4 16 1 2 3 4 5 6 7 8 9 10 11 12
      `.trim();
    const parsed = parse(str);
    expect(parsed).toBeTruthy();
    const quad = parsed!.files[0].quads[0];
    expect(quad).toBeTruthy();
    expect(quad.x1).toEqual(1);
    expect(quad.y1).toEqual(2);
    expect(quad.z1).toEqual(3);
    expect(quad.x2).toEqual(4);
    expect(quad.y2).toEqual(5);
    expect(quad.z2).toEqual(6);
    expect(quad.x3).toEqual(7);
    expect(quad.y3).toEqual(8);
    expect(quad.z3).toEqual(9);
    expect(quad.x4).toEqual(10);
    expect(quad.y4).toEqual(11);
    expect(quad.z4).toEqual(12);
  });
});
