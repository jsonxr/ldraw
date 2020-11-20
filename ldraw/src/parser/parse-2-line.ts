import { State, CommandParser, ParsedCommand } from './utils';
import { Line } from '../Line';

export const LINE: CommandParser = {
  match: /^\s*2\s+(.*)$/,
  parseLine: (state: State, cmd: ParsedCommand) => {
    const args = cmd.args[0]
      .trim()
      .split(/\s+/)
      .map((s) => s.trim());
    const line = new Line({
      lineNo: state.index,
      colour: parseInt(args[0], 10),
      x1: parseFloat(args[1]),
      y1: parseFloat(args[2]),
      z1: parseFloat(args[3]),
      x2: parseFloat(args[4]),
      y2: parseFloat(args[5]),
      z2: parseFloat(args[6]),
    });
    state.files[state.files.length - 1].specs.push(line);
    return true;
  },
};
