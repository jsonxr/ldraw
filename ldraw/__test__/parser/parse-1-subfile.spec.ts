import { parse } from '../../src/parser/parse';
import { singleFile } from '../test-utils';

describe('"1" - subfile', () => {
  it('should parse a subfile line', () => {
    // 1 <colour> x y z a b c d e f g h i <file>
    const parsed = parse(singleFile('1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat'));

    expect(parsed?.files?.length).toEqual(1);
    const file = parsed!.files[0];
    expect(file.subfiles.length).toEqual(1);
    const subfile = file.subfiles[0];
    expect(subfile.inverted).toBeFalsy();
    //expect(subfile.animated).toBeFalsy();
    expect(subfile.colour).toEqual(16);
    expect(subfile.x).toEqual(1);
    expect(subfile.y).toEqual(2);
    expect(subfile.z).toEqual(3);
    expect(subfile.a).toEqual(4);
    expect(subfile.b).toEqual(5);
    expect(subfile.c).toEqual(6);
    expect(subfile.d).toEqual(7);
    expect(subfile.e).toEqual(8);
    expect(subfile.f).toEqual(9);
    expect(subfile.g).toEqual(10);
    expect(subfile.h).toEqual(11);
    expect(subfile.i).toEqual(12);
  });
});
