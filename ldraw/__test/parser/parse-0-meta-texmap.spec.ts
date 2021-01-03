import { parse } from '../../src/parser/parse';
import { Meta } from '../../src/Meta';
import { SingleFile } from '../../src/SingleFile';

describe('0 !TEXMAP', () => {
  it('should ignore !TEXMAP', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !TEXMAP START
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed.commands.length).toEqual(8);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed.metas[5]).toEqual(
      new Meta({ type: 'TEXMAP', lineNo: 7, line: '0 !TEXMAP START' })
    );
  });
});
