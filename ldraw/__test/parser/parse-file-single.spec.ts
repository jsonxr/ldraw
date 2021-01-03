import { parse } from '../../src/parser/parse';
import { ParseError } from '../../src/parser/ParseError';

describe('parser/parse', () => {
  it('should throw an error if encounters an unknown command', () => {
    const str = `
      0 file.dat
      0 Name: file.dat
      0 Author: Part Author [theauthor]
      0 !LDRAW_ORG Model
      0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
      1 1 2 3 4 5 6 7 8 9 10 11 12 13 file.lpr
      6 Fake command
    `.trim();
    const error = new ParseError('Invalid LDraw file', {
      lineNo: 7,
      lines: str.trim().split('\n'),
    });
    expect.assertions(1);
    expect(() => {
      parse(str);
    }).toThrowError(error);
  });

  it('should error if encounters a "0 FILE" command', () => {
    const str = `
    0 file.dat
    0 Name: file.dat
    0 Author: Part Author [theauthor]
    0 !LDRAW_ORG Model
    0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    3 26 1 2 3 4 5 6 7 8 9
    0 FILE 2.dat
  `.trim();
    const error = new ParseError('Invalid LDraw file', {
      lineNo: 7,
      lines: str.trim().split('\n'),
    });
    expect.assertions(1);
    expect(() => {
      parse(str);
    }).toThrowError(error);
  });

  it('should error if encounters a "0 !DATA" command', () => {
    const str = `
    0 file.dat
    0 Name: file.dat
    0 Author: Part Author [theauthor]
    0 !LDRAW_ORG Model
    0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
    3 26 1 2 3 4 5 6 7 8 9
    0 !DATA sticker
  `.trim();
    const error = new ParseError('Invalid LDraw file', {
      lineNo: 7,
      lines: str.trim().split('\n'),
    });
    expect.assertions(1);
    expect(() => {
      const parsed = parse(str);
      console.log(parsed);
    }).toThrowError(error);
  });
});
