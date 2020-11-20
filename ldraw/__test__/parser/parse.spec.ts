import { ParseError } from '../../src/parser/ParseError';
import { parse } from '../../src/parser/parse';
import { SINGLEFILE } from '../../src/parser/parse-single';
import { MPDFILE } from '../../src/parser/parse-mpd';
import { State } from '../../src/parser/utils';

jest.mock('../../src/parser/parse-single');
jest.mock('../../src/parser/parse-mpd');

describe('parser/parse', () => {
  beforeEach(() => {
    (SINGLEFILE as jest.Mock).mockImplementation(
      (state: State) => (state.index = state.strings.length)
    );
  });

  it('should recognize a file that starts with "0 FILE" is an MPD', () => {
    parse(`0 !DATA sticker.png`);
    expect(MPDFILE).toHaveBeenCalled();
  });

  it('should recognize a file that starts with "0 FILE" is an MPD', () => {
    parse(`0 FILE file.lpr`);
    expect(MPDFILE).toHaveBeenCalled();
  });

  it('should skip whitespace at beginning of a file', () => {
    parse(`\n0 FILE file.lpr`);
    expect(MPDFILE).toHaveBeenCalled();
  });

  it('should allow comments before "0 !DATA"', () => {
    parse(`
      0 My Comment
      0 !DATA sticker.png
    `);
    expect(MPDFILE).toHaveBeenCalled();
  });

  it('should allow comments before either "0 FILE"', () => {
    parse(`
      0 My Comment
      0 FILE file.lpr
    `);
    expect(MPDFILE).toHaveBeenCalled();
  });

  it('should should return a single part if first command is a 1', () => {
    parse(`
      0 My Comment
      1
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });

  it('should should return a single part if first command is a 2', () => {
    parse(`
      0 My Comment
      2
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });
  it('should should return a single part if first command is a 3', () => {
    parse(`
      0 My Comment
      3
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });
  it('should should return a single part if first command is a 4', () => {
    parse(`
      0 My Comment
      4
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });

  it('should should return a single part if first command is a 5', () => {
    parse(`
      0 My Comment
      5
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });

  it('should throw an error if a line starts with any character not in 0-5', () => {
    const str = `
      0 My Comment
      a
    `.trim();
    const error = new ParseError('Invalid LDraw file', {
      lineNo: 1,
      lines: str.split('\n'),
    });
    expect.assertions(1);
    expect(() => {
      parse(str);
    }).toThrowError(error);
  });

  it('should return single file if a file full of comments', () => {
    parse(`
      0 My Comment
      0
    `);
    expect(SINGLEFILE).toHaveBeenCalled();
  });
  it('should return null if it is just a bunch of blank lines', () => {
    const parsed = parse('');
    expect(parsed).toBeNull();
  });
});
