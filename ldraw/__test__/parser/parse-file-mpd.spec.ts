import { parse } from '../../src/parser/parse';
import { mpdFile, singleFile, triangle } from '../test-utils';

describe('parser/parse-mpd', () => {
  it('should have proper mpd when passing in name', () => {
    const f = mpdFile('', { name: 'main.ldr' });
    expect(f).toEqual(
      `
0 FILE main.ldr
0 main.ldr
0 Name: main.ldr
0 Author: Jason Rowland [jason]
0 !LDRAW_ORG Model
0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt`.trim()
    );
  });

  it('should have proper mpd when not passing in name', () => {
    const f = mpdFile('');
    expect(f).toEqual(
      `
0 FILE single.dat
0 single.dat
0 Name: single.dat
0 Author: Jason Rowland [jason]
0 !LDRAW_ORG Model
0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt`.trim()
    );
  });

  it('should parse to have file with name', () => {
    const parsed = parse(mpdFile('', { name: 'main.ldr' }));
    expect(parsed?.files.length).toEqual(1);
    const file = parsed!.files[0];
    expect(file.name).toEqual('main.ldr'); // The name actually comes from the header block
  });

  it('should parse multiple files inside an mpd', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}

      0 FILE model2.ldr
      ${singleFile('', { name: 'model2.ldr' })}
    `);
    expect(parsed?.files.length).toEqual(2);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[1].name).toEqual('model2.ldr');
  });

  it('should parse a FILE when data is first', () => {
    const parsed = parse(`
      0 !DATA sticker.png

      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}
    `);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
  });

  it('should terminate a FILE and ignore everything until another FILE', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}
      ${triangle()}
      ${triangle()}
      0 NOFILE

      garbage text here is ok according to spec (i think)...
      ${triangle()} // Ignores this since after NOFILE and before a FILE...

      0 FILE model2.ldr
      ${singleFile(`${triangle()}`, { name: 'model2.ldr' })}
    `);
    expect(parsed?.files.length).toEqual(2);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
    expect(parsed!.files[1].name).toEqual('model2.ldr');
    expect(parsed!.files[1].triangles.length).toEqual(1);
  });

  it('should terminate a FILE and ignore everything until another !DATA', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}
      ${triangle()}
      ${triangle()}
      0 NOFILE

      garbage text here is ok according to spec (i think)...
      ${triangle()} // Ignores this since after NOFILE and before a FILE...

      0 !DATA single.png
    `);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
    expect(parsed!.data.length).toEqual(1);
  });

  it('should ignore everything after 0 NOFILE', () => {
    const parsed = parse(`
      0 FILE model1.ldr
      ${singleFile('', { name: 'model1.ldr' })}
      ${triangle()}
      ${triangle()}
      0 NOFILE

      garbage text here is ok according to spec (i think)...
      ${triangle()} // Ignores this since after NOFILE and before a FILE...
    `);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].name).toEqual('model1.ldr');
    expect(parsed!.files[0].triangles.length).toEqual(2);
  });
});
