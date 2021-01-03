import { parse } from '../../src/parser/parse';
import { SingleFile } from 'ldraw';

describe('parser/parse', () => {
  it('should parse a name', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].name).toEqual('file.dat');
    expect(parsed!.files[0].meta.category).toEqual('Brick');
    expect(parsed!.files[0].meta.description).toEqual('2 x  4');
  });

  it('should parse an author', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].name).toEqual('file.dat');
    expect(parsed!.files[0].meta.author).toEqual('Part Author [theauthor]');
    expect(parsed!.files[0].meta.category).toEqual('Brick');
    expect(parsed!.files[0].meta.description).toEqual('2 x  4');
  });

  it('should parse an invalid ordering of author, name', () => {
    const str = `
      0 Brick  2 x  4
      0 Author: Part Author [theauthor]
      0 Name: file.dat
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].name).toEqual('file.dat');
    expect(parsed!.files[0].meta.author).toEqual('Part Author [theauthor]');
    expect(parsed!.files[0].meta.category).toEqual('Brick');
    expect(parsed!.files[0].meta.description).toEqual('2 x  4');
  });

  it('should parse ok if missing Name', () => {
    const str = `
      0 Brick  2 x  4
      0 Not a name
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed?.name).toBeFalsy();
  });

  it('should parse ok if missing author', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Not an Author: Part Author [theauthor]
      0 !LDRAW_ORG error
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed?.meta?.author).toBeFalsy();
  });

  it('should parse ok if missing !LDRAW_ORG', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 Not an !LDRAW_ORG
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed?.type).toEqual('Unknown');
  });

  it('should parse ok if invalid !LDRAW_ORG', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG error
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed?.type).toEqual('error');
  });

  it('should parse ok if missing !LICENSE', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 Not a !LICENSE
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed?.meta?.license).toBeUndefined();
  });

  it('should set the category if the first word matches a valid category', () => {
    const str = `
      0 Brick  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].meta.category).toEqual('Brick');
    expect(parsed!.files[0].meta.description).toEqual('2 x  4');
  });

  it('should not set the category if the first word does not match a valid category', () => {
    const str = `
      0 Fake  2 x  4
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].meta.category).toBeFalsy();
    expect(parsed!.files[0].meta.description).toEqual('Fake  2 x  4');
  });

  it('should set the category only if it matches a valid category and no description', () => {
    const str = `
      0 Brick
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Part
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    `;
    const parsed: SingleFile = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed!.files[0].meta.category).toEqual('Brick');
    expect(parsed!.files[0].meta.description).toEqual('');
  });
});
