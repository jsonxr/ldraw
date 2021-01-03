import { Comment } from '../Comment';
import {
  State,
  CommandParser,
  CommandMatcher,
  ParsedCommand,
  findCommand,
} from './utils';

export const META_ANY: CommandMatcher = {
  match: /^0\s+(?:!\S+|FILE|NOFILE|BFC)/,
};

export const COMMENT: CommandParser = {
  match: /^0\s*(.*)$/,
  parseLine: (state: State, { line }: ParsedCommand) => {
    // If these are meta commands, do not process them
    const isMeta = findCommand(line, [META_ANY]);
    if (isMeta) {
      return false;
    }

    const comment = new Comment({
      lineNo: state.index + 1,
      line: state.strings[state.index],
    });
    state.files[state.files.length - 1].commands.push(comment);

    return true;
  },
};
