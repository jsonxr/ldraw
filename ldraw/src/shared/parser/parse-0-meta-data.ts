import { CommandParser, ParsedCommand, parseStrings, State } from './utils';
import { Data } from '../Data';

export const BASE64: CommandParser = {
  match: /^0\s+!:\s+(.*)$/,
  parseLine: (state: State, cmd: ParsedCommand) => {
    state.data[state.data.length - 1].push(cmd.args[0].trim());
    return true;
  },
};

export const DATA: CommandParser = {
  match: /^0\s+!DATA\s+(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    state.data.push(new Data({ name: args[0] }));
    state.index++;
    return parseStrings(state, [BASE64]);
  },
};
