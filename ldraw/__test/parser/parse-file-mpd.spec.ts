import { parse } from '../../src/shared/parser/parse';

describe('parser/parse-mpd', () => {
  it('should parse to have file with name', () => {
    const str = `
      0 main.ldr
      0 Name: main.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    const file = parsed!.files[0];
    expect(file.name).toEqual('main.ldr'); // The name actually comes from the header block
  });

  it('should parse multiple files inside an mpd', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

      0 FILE model2.ldr
      0 model2.ldr
      0 Name: model2.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    `);
    expect(parsed?.files.length).toEqual(2);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[1].name).toEqual('model2.ldr');
  });

  it('should parse a FILE when data is first', () => {
    const str = `
      0 !DATA sticker.png

      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      `;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
  });

  it('should terminate a FILE and ignore everything until another FILE', () => {
    const str = `
      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      3 16 1 2 3 4 5 6 7 8 9
      3 16 1 2 3 4 5 6 7 8 9
      0 NOFILE

      garbage text here is ok according to spec (i think)...
      3 16 1 2 3 4 5 6 7 8 9 // Ignores this since after NOFILE and before a FILE...

      0 FILE model2.ldr
      0 model2.ldr
      0 Name: model2.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      3 16 1 2 3 4 5 6 7 8 9`;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(2);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
    expect(parsed!.files[1].name).toEqual('model2.ldr');
    expect(parsed!.files[1].triangles.length).toEqual(1);
  });

  it('should terminate a FILE and ignore everything until another !DATA', () => {
    const str = `
      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      3 16 1 2 3 4 5 6 7 8 9
      3 16 1 2 3 4 5 6 7 8 9
      0 NOFILE

      garbage text here is ok according to spec (i think)...
      3 16 1 2 3 4 5 6 7 8 9 // Ignores this since after NOFILE and before a FILE...

      0 !DATA single.png`;
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
    expect(parsed!.data.length).toEqual(1);
  });

  it('should ignore everything after 0 NOFILE', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      0 model1.ldr
      0 Name: model1.ldr
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      3 16 1 2 3 4 5 6 7 8 9
      3 16 1 2 3 4 5 6 7 8 9
      0 NOFILE

      0 NOFILE

      garbage text here is ok according to spec (i think)...
      3 16 1 2 3 4 5 6 7 8 9 // Ignores this since after NOFILE and before a FILE...
    `);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
  });
});
