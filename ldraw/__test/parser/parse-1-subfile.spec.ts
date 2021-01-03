import { SingleFile } from '../../src/SingleFile';
import { parse } from '../../src/parser/parse';

describe('"1" - subfile', () => {
  it('should parse a subfile line', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat
      `.trim();
    // 1 <colour> x y z a b c d e f g h i <file>
    const parsed = parse(str);

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

  it('should parse a subfile filename with spaces', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      1 16 1 2 3 4 5 6 7 8 9 10 11 12 10270 - 819.dat
      `.trim();
    // 1 <colour> x y z a b c d e f g h i <file>
    const parsed = parse(str);
    expect(parsed?.files?.length).toEqual(1);
    const file = parsed as SingleFile;
    expect(file.subfiles.length).toEqual(1);
    const subfile = file.subfiles[0];
    expect(subfile.file).toEqual('10270 - 819.dat');
  });
});
