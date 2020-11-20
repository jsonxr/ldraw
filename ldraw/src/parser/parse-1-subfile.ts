import { State, CommandParser, ParsedCommand } from './utils';
import { SubFile } from '../SubFile';

export const SUBFILE: CommandParser = {
  match: /^\s*1\s+(.*)$/,
  parseLine: (state: State, cmd: ParsedCommand) => {
    const args = cmd.args[0]
      .trim()
      .split(/\s+/)
      .map((s) => s.trim());
    const subfile = new SubFile({
      lineNo: state.index,
      colour: parseInt(args[0], 10),
      x: parseFloat(args[1]),
      y: parseFloat(args[2]),
      z: parseFloat(args[3]),
      a: parseFloat(args[4]),
      b: parseFloat(args[5]),
      c: parseFloat(args[6]),
      d: parseFloat(args[7]),
      e: parseFloat(args[8]),
      f: parseFloat(args[9]),
      g: parseFloat(args[10]),
      h: parseFloat(args[11]),
      i: parseFloat(args[12]),
      file: args[13].toLowerCase().replaceAll('\\', '/'),
    });
    if (state.inverted) subfile.inverted = true;
    // if (state.animated) subfile.animated = true;
    // if (state.animatedName) subfile.animatedName = state.animatedName;

    state.files[state.files.length - 1].specs.push(subfile);
    state.inverted = false;
    // state.animated = false;
    // state.animatedName = undefined;
    return true;
  },
};
