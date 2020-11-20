import { parseStrings, ProcessorFn, State } from './utils';
import { DATA } from './parse-0-meta-data';
import { FILE, NOFILE } from './parse-0-meta-file';
import { ParseError } from './ParseError';

export const MPDFILE: ProcessorFn = (state: State) => {
  while (state.index < state.strings.length) {
    const index = state.index;
    parseStrings(state, [DATA, FILE, NOFILE]);
    if (index === state.index) {
      throw new ParseError('Parser was unable to parse file', {
        lineNo: state.index + 1,
        lines: state.strings,
      });
    }
  }
  return true; // TODO: Do we have the same problem here since we are returning true?
};
