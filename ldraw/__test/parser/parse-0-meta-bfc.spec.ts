import { parse } from '../../src/parser/parse';
import { Meta } from '../../src/Meta';
import { ParseError } from '../../src/parser/ParseError';
import { SingleFile } from '../../src/SingleFile';

describe('0 BFC - BFC Language Extension', () => {
  it('should throw error if no text after BFC', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC
    `.trim();
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
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC NOCERTIFY
      3 16 1 2 3 4 5 6 7 8 9
    `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeFalsy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CCW');
  });

  it('should handle 0 BFC CERTIFY', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC CERTIFY
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CCW');
  });

  it('should handle 0 BFC CERTIFY CW', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC CERTIFY CW
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CW');
  });

  it('should handle 0 BFC CERTIFY CCW', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC CERTIFY CCW
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CCW');
  });

  it('should handle 0 BFC CW', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC CW
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CW');
  });

  it('should handle 0 BFC CCW', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC CCW
      3 16 1 2 3 4 5 6 7 8 9
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].triangles[0].certified).toBeTruthy();
    expect(parsed!.files[0].triangles[0].winding).toEqual('CCW');
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
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC INVERTNEXT
      1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat
      1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].subfiles[0].inverted).toBeTruthy();
    expect(parsed!.files[0].subfiles[1].inverted).toBeFalsy();
  });

  it('should handle 0 BFC <unknown> by creating a spec entry', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 BFC ???
      `.trim();
    const parsed = parse(str) as SingleFile;
    expect(parsed?.files.length).toEqual(1);
    expect(parsed.commands.length).toEqual(6);
    const meta = new Meta({ lineNo: 6, line: '0 BFC ???' });
    expect(parsed.metas[5]).toEqual(meta);
  });
});
