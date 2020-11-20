import { Winding } from '../../src/Winding';
import { parse } from '../../src/parser/parse';
import { Meta } from '../../src/Meta';
import { singleFile } from '../test-utils';
import { ParseError } from '../../src/parser/ParseError';

// const singleFile = (txt: string) =>
//   `
// 0 Complete
// 0 Name: 10270 - Complete.ldr
// 0 Author: Ulrich Röder [UR]
// 0 !LDRAW_ORG Model
// 0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

// ${txt}
// `.trim();

describe('0 BFC - BFC Language Extension', () => {
  it('should throw error if no text after BFC', () => {
    const str = singleFile('0 BFC');
    expect.assertions(1);
    const error = new ParseError('Invalid LDraw file', {
      lineNo: 6,
      lines: str.split('\n'),
    });
    expect(() => {
      parse(str);
    }).toThrowError(error);
  });

  it('should handle 0 BFC NOCERTIFY', () => {
    const parsed = parse(
      singleFile(`
        0 BFC NOCERTIFY
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeFalsy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CCW);
  });

  it('should handle 0 BFC CERTIFY', () => {
    const parsed = parse(
      singleFile(`
        0 BFC CERTIFY
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CCW);
  });

  it('should handle 0 BFC CERTIFY CW', () => {
    const parsed = parse(
      singleFile(`
        0 BFC CERTIFY CW
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CW);
  });

  it('should handle 0 BFC CERTIFY CCW', () => {
    const parsed = parse(
      singleFile(`
        0 BFC CERTIFY CCW
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CCW);
  });

  it('should handle 0 BFC CW', () => {
    const parsed = parse(
      singleFile(`
        0 BFC CW
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CW);
  });

  it('should handle 0 BFC CCW', () => {
    const parsed = parse(
      singleFile(`
        0 BFC CCW
        3 16 1 2 3 4 5 6 7 8 9
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual(Winding.CCW);
  });

  it.skip('should handle 0 BFC CLIP', () => {
    expect(true).toBeFalsy();
  });
  it.skip('should handle 0 BFC CLIP CW', () => {
    expect(true).toBeFalsy();
  });
  it.skip('should handle 0 BFC CLIP CCW', () => {
    expect(true).toBeFalsy();
  });
  it.skip('should handle 0 BFC NOCLIP', () => {
    expect(true).toBeFalsy();
  });

  it('should handle 0 BFC INVERTNEXT', () => {
    const parsed = parse(
      singleFile(`
        0 BFC INVERTNEXT
        1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat
        1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat
      `)
    );
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].subfiles[0].inverted).toBeTruthy();
    expect(parsed!.files[0].subfiles[1].inverted).toBeFalsy();
  });

  it('should handle 0 BFC <unknown> by creating a spec entry', () => {
    const meta = new Meta({ lineNo: 6, line: '0 BFC ???' });
    const parsed = parse(singleFile('0 BFC ???'));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].specs.length).toEqual(1);
    expect(parsed!.files[0].specs[0]).toEqual(meta);
  });
});
