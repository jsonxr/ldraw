import { parse } from '../../src/parser/parse';

describe('"3" - triangle', () => {
  it('should add a triangle', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed).toBeTruthy();
    const triangle = parsed!.files[0].triangles[0];
    expect(triangle).toBeTruthy();
    expect(triangle.x1).toEqual(1);
    expect(triangle.y1).toEqual(2);
    expect(triangle.z1).toEqual(3);
    expect(triangle.x2).toEqual(4);
    expect(triangle.y2).toEqual(5);
    expect(triangle.z2).toEqual(6);
    expect(triangle.x3).toEqual(7);
    expect(triangle.y3).toEqual(8);
    expect(triangle.z3).toEqual(9);
  });
});
