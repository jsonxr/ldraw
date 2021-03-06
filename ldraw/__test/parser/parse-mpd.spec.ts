import { ParseError } from '../../src/shared/parser/ParseError';
import { MPDFILE } from '../../src/shared/parser/parse-mpd';
import { parseStrings, State } from '../../src/shared/parser/utils';

jest.mock('../../src/shared/parser/utils');

describe('parser/parse', () => {
  it('should not go into infinite loop on programming mistake', () => {
    const state = { index: 3, strings: ['1', '2', '3', '4', '5'] } as State;
    (parseStrings as jest.Mock).mockReturnValue(true); // process but don't advance index
    const error = new ParseError('Parser was unable to parse file', {
      lineNo: state.index + 1,
      lines: state.strings,
    });
    expect.assertions(1);
    expect(() => {
      MPDFILE(state);
    }).toThrowError(error);
  });
});
