import { Comment } from '../Comment';
import { State, CommandParser, ParsedCommand } from './utils';

export const COMMENT: CommandParser = {
  match: /^\s*0(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const tokens = args[0]
      .trim()
      .split(/\s+/)
      .map((t) => t.trim());

    // If these are meta commands, do not process them
    const isMpdCommand =
      tokens[0] === 'BFC' ||
      tokens[0] === 'FILE' ||
      tokens[0] === '!DATA' ||
      tokens[0] === 'NOFILE' ||
      tokens[0].startsWith('!');
    if (isMpdCommand) {
      return false; // Don't advance state.index
    }

    const comment = new Comment({
      lineNo: state.index,
      line: state.strings[state.index],
    });
    state.files[state.files.length - 1].specs.push(comment);

    return true;
  },
};
