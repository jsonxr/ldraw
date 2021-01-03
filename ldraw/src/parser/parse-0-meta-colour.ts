import {
  CommandParser,
  chompCommands,
  ParsedCommand,
  parseLine,
  State,
} from './utils';
import { Colour, ColourFinish, ColourMaterial } from '../Colour';
import { ParseError } from './ParseError';

// 0 !COLOUR name CODE x VALUE v EDGE e [ALPHA a] [LUMINANCE l] [ CHROME |
// PEARLESCENT | RUBBER | MATTE_METALLIC | METAL | MATERIAL <params> ]

const ALPHA = {
  match: /^ALPHA\s+(\d+)/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const colour = file.commands[file.commands.length - 1] as Colour;
    colour.alpha = parseInt(args[0], 10);
    return false;
  },
};

const LUMINANCE = {
  match: /^LUMINANCE\s+(\d+)/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const colour = file.commands[file.commands.length - 1] as Colour;
    colour.luminance = parseInt(args[0], 10);
    return false;
  },
};

const parseFinishAttribute = (
  match: RegExp,
  fn: (m: ColourMaterial, s: string) => void
) => ({
  match,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const colour = file.commands[file.commands.length - 1] as Colour;
    fn(colour.material as ColourMaterial, args[0]);
    return false;
  },
});

const MATERIAL_ALPHA = parseFinishAttribute(
  /^ALPHA\s+(\d+)/,
  (m: ColourMaterial, str: string) => (m.alpha = parseInt(str, 10))
);

const MATERIAL_LUMINANCE = parseFinishAttribute(
  /^LUMINANCE\s+(\d+)/,
  (m: ColourMaterial, str: string) => (m.luminance = parseInt(str, 10))
);

const MATERIAL_FRACTION = parseFinishAttribute(
  /^FRACTION\s+(\S+)/,
  (m: ColourMaterial, str: string) => (m.fraction = parseFloat(str))
);

const MATERIAL_VFRACTION = parseFinishAttribute(
  /^VFRACTION\s+(\S+)/,
  (m: ColourMaterial, str: string) => (m.vfraction = parseFloat(str))
);

const MATERIAL_MINSIZE = parseFinishAttribute(
  /^MINSIZE\s+(\S+)/,
  (m: ColourMaterial, str: string) => (m.minsize = parseFloat(str))
);

const MATERIAL_MAXSIZE = parseFinishAttribute(
  /^MAXSIZE\s+(\S+)/,
  (m: ColourMaterial, str: string) => (m.maxsize = parseFloat(str))
);

const MATERIAL_SIZE = parseFinishAttribute(
  /^SIZE\s+(\S+)/,
  (m: ColourMaterial, str: string) => (m.size = parseFloat(str))
);

const FINISH_MATERIAL = {
  match: /^MATERIAL\s+(\S+)\s+VALUE\s+(\S+)\s+(.*)/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const colour = file.commands[file.commands.length - 1] as Colour;
    colour.finish = 'MATERIAL';
    colour.material = { name: args[0], value: args[1] } as ColourMaterial;
    chompCommands(state, args[2], [
      MATERIAL_ALPHA,
      MATERIAL_LUMINANCE,
      MATERIAL_FRACTION,
      MATERIAL_MINSIZE,
      MATERIAL_MAXSIZE,
      MATERIAL_SIZE,
      MATERIAL_VFRACTION,
    ]);
    return false;
  },
};

const FINISH = {
  match: /^(CHROME|PEARLESCENT|RUBBER|MATTE_METALLIC|METAL)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const colour = file.commands[file.commands.length - 1] as Colour;
    colour.finish = args[0] as ColourFinish;
    return false;
  },
};

// 0                              // LEGOID  26 - Black
// 0 !COLOUR Black                                                 CODE   0   VALUE #1B2A34   EDGE #808080
export const COLOUR: CommandParser = {
  match: /^0\s+!COLOUR\s+(\S*)\s+CODE\s+(\d+)\s+VALUE\s+(\S+)\s+EDGE\s(\S+)\s*(.*)/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];

    const colour = new Colour({
      name: args[0],
      code: parseInt(args[1], 10),
      value: args[2],
      edge: args[3],
    });

    const previousLine = state.strings[state.index - 1];
    parseLine(
      previousLine,
      /^0\s+\/\/\s+LEGOID\s+(\d+)\s+-\s+(.*)/,
      ({ args }: ParsedCommand) => {
        colour.legoId = parseInt(args[0], 10);
        colour.display = args[1].trim();
      }
    );

    file.commands.push(colour);
    if (args[4]) {
      const leftOvers = chompCommands(state, args[4], [
        FINISH,
        FINISH_MATERIAL,
        ALPHA,
        LUMINANCE,
      ]);

      if (leftOvers) {
        throw ParseError.InvalidLDrawFile(state);
      }
    }
    return true;
  },
};
