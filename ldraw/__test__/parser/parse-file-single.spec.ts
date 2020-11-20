import { parse } from '../../src/parser/parse';
import { ParseError } from '../../src/parser/ParseError';
import { singleFile } from '../test-utils';

describe('parser/parse', () => {
  describe('General', () => {
    it('should throw an error if invalid header', () => {
      const str = `
        0 Comment
        1 <colour> x y z a b c d e f g h i <file>
      `.trim();
      const error = new ParseError('Invalid LDraw file', {
        lineNo: 1,
        lines: str.split('\n'),
      });
      expect(() => {
        parse(str);
      }).toThrowError(error);
    });

    it('should throw an error if encounters an unknown command', () => {
      const str = singleFile(`
        1 1 2 3 4 5 6 7 8 9 10 11 12 13 file.lpr
        6 Fake command
      `);
      const error = new ParseError('Invalid LDraw file', {
        lineNo: 7,
        lines: str.split('\n'),
      });
      expect.assertions(1);
      expect(() => {
        parse(str);
      }).toThrowError(error);
    });
  });

  it('should error if encounters a "0 FILE" command', () => {
    const str = singleFile(`
      3 26 1 2 3 4 5 6 7 8 9
      0 FILE 2.dat
    `);
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
    const str = singleFile(`
      3 26 1 2 3 4 5 6 7 8 9
      0 !DATA sticker
    `);
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
