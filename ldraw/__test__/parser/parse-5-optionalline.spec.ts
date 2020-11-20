import { parse } from '../../src/parser/parse';
import { singleFile } from '../test-utils';

describe('"5" - optional line', () => {
  it('should add an optional line', () => {
    const parsed = parse(singleFile('5 16 1 2 3 4 5 6 7 8 9 10 11 12'));
    expect(parsed).toBeTruthy();
    const optionalLine = parsed!.files[0].optionalLines[0];
    expect(optionalLine).toBeTruthy();
    expect(optionalLine.x1).toEqual(1);
    expect(optionalLine.y1).toEqual(2);
    expect(optionalLine.z1).toEqual(3);
    expect(optionalLine.x2).toEqual(4);
    expect(optionalLine.y2).toEqual(5);
    expect(optionalLine.z2).toEqual(6);
    expect(optionalLine.x3).toEqual(7);
    expect(optionalLine.y3).toEqual(8);
    expect(optionalLine.z3).toEqual(9);
    expect(optionalLine.x4).toEqual(10);
    expect(optionalLine.y4).toEqual(11);
    expect(optionalLine.z4).toEqual(12);
  });
});
