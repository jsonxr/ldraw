import { parse } from '../../src/shared/parser/parse';
import { Meta } from '../../src/shared/Meta';
import { SingleFile } from '../../src/shared/SingleFile';

describe('0 !', () => {
  it('should ignore !CMDLINE metas', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !CMDLINE x
      `.trim();
    const parsed = parse(str) as SingleFile;
    expect(parsed.files?.length).toEqual(1);
    expect(parsed.files[0].metas[5]).toEqual(
      new Meta({ lineNo: 6, line: '0 !CMDLINE x' })
    );
  });

  it('should ignore !LDCAD metas', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !LDCAD x
      `.trim();
    const parsed = parse(str) as SingleFile;
    expect(parsed.files?.length).toEqual(1);
    expect(parsed.commands.length).toEqual(6);

    expect(parsed.metas[5]).toEqual(
      new Meta({ lineNo: 6, line: '0 !LDCAD x' })
    );
  });

  it('should set a !THEME', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !THEME xyz 123
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.theme).toEqual('xyz 123');
  });

  it('should add !HISTORY entries', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !HISTORY xyz 123
      0 !HISTORY abc
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.history?.length).toEqual(2);
    expect(parsed!.files[0].meta.history![0]).toEqual('xyz 123');
    expect(parsed!.files[0].meta.history![1]).toEqual('abc');
  });

  it('should add !HELP entries', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !HELP xyz 123
      0 !HELP abc
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.help?.length).toEqual(2);
    expect(parsed!.files[0].meta.help![0]).toEqual('xyz 123');
    expect(parsed!.files[0].meta.help![1]).toEqual('abc');
  });

  it('should add !CATEGORY', () => {
    const str = `
      0 Brck 2 x 4
      0 Name: brick.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

      0 !CATEGORY Minifig Accessory
    `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.category).toEqual('Minifig Accessory');
  });

  it('should ignore a further !CATEGORY', () => {
    const str = `
      0 Brck 2 x 4
      0 Name: brick.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

      0 !CATEGORY Minifig Accessory
      0 !CATEGORY Invalid Entry
    `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.category).toEqual('Minifig Accessory');
  });

  it('should allow an unknown category', () => {
    const str = `
      0 Brck 2 x 4
      0 Name: brick.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

      0 !CATEGORY Fake Category
    `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.category).toEqual('Fake Category');
  });

  it('should add !KEYWORDS entries', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !KEYWORDS X Y Z,A, B, C,
      0 !KEYWORDS abc
      `.trim();
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.keywords?.length).toEqual(5);
  });

  it('should add a Meta for an unknown command', () => {
    const str = `
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      0 !UNKNOWN x y z
      `.trim();

    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].commands.length).toEqual(6);
    expect(parsed!.files[0].metas[5]).toEqual(
      new Meta({ lineNo: 6, line: '0 !UNKNOWN x y z' })
    );
  });
});
