import { parse } from '../../src/parser/parse';
import { singleFile } from '../test-utils';

describe('"3" - triangle', () => {
  it('should add a triangle', () => {
    const parsed = parse(singleFile('3 16 1 2 3 4 5 6 7 8 9'));
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
