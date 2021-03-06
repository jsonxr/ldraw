import { State, CommandParser, ParsedCommand } from './utils';
import { SubFile } from '../SubFile';
import { cleanFilename } from '../utils/clean-filename';

export const SUBFILE: CommandParser = {
  match: /^1\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/,
  parseLine: (state: State, cmd: ParsedCommand) => {
    const { args } = cmd;
    const subfile = new SubFile({
      lineNo: state.index + 1,
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
      file: cleanFilename(args[13]),
    });
    if (state.inverted) subfile.inverted = true;
    // if (state.animated) subfile.animated = true;
    // if (state.animatedName) subfile.animatedName = state.animatedName;

    state.files[state.files.length - 1].commands.push(subfile);
    state.inverted = false;
    // state.animated = false;
    // state.animatedName = undefined;
    return true;
  },
};
