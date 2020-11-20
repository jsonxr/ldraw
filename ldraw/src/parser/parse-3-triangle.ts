import { State, CommandParser, ParsedCommand } from './utils';
import { Triangle } from '../Triangle';

export const TRIANGLE: CommandParser = {
  match: /^\s*3\s+(.*)$/,
  parseLine: (state: State, cmd: ParsedCommand) => {
    const args = cmd.args[0]
      .trim()
      .split(/\s+/)
      .map((s) => s.trim());
    const triangle = new Triangle({
      lineNo: state.index,
      certified: state.certified,
      winding: state.winding,
      colour: parseInt(args[0], 10),
      x1: parseFloat(args[1]),
      y1: parseFloat(args[2]),
      z1: parseFloat(args[3]),
      x2: parseFloat(args[4]),
      y2: parseFloat(args[5]),
      z2: parseFloat(args[6]),
      x3: parseFloat(args[7]),
      y3: parseFloat(args[8]),
      z3: parseFloat(args[9]),
    });
    state.files[state.files.length - 1].specs.push(triangle);
    return true;
  },
};
