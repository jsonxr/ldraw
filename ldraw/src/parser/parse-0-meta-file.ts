import { CommandParser, ParsedCommand, State } from './utils';
import { SINGLEFILE } from './parse-single';
import { SingleFile } from '../SingleFile';

export const NOFILE: CommandParser = {
  match: /^0\sNOFILE/,
  parseLine: (state: State) => {
    while (state.index < state.strings.length) {
      // As long as we have strings to process and we haven't failed yet, keep on processing
      const str = state.strings[state.index];
      if (!str) {
        state.index++;
        continue;
      }

      if (str.match(/^0 [FILE|!DATA]/)) {
        return false; // don't advance state.index
      } else {
        state.index++;
      }
    }

    return true;
  },
};

export const FILE: CommandParser = {
  match: /^0\sFILE\s+(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    state.files.push(new SingleFile({ name: args[0] }));
    state.index++;
    SINGLEFILE(state);
    return false; // TODO: Parsing Multi fails if this is here... why?  we dont' want to advance state.index
  },
};
