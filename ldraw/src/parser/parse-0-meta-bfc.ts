import { Meta } from '../Meta';
import { Winding } from '../Winding';
import { ParseError } from './ParseError';
import { State, CommandParser, parseCommand, ParsedCommand } from './utils';

export const BFC_CERTIFIY: CommandParser = {
  match: /^0\sBFC\sCERTIFY\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    if (args[0]) {
      // 0 BFC CERTIFY CW
      // 0 BFC CERTIFY CCW
      state.winding = args[0] === 'CCW' ? Winding.CCW : Winding.CW;
    } else {
      // 0 BFC CERTIFY (CCW is implied)
      state.winding = Winding.CCW;
    }
    return true;
  },
};

export const BFC_CW: CommandParser = {
  match: /^0\sBFC\sCW$/,
  parseLine: (state: State) => {
    state.winding = Winding.CW;
    return true;
  },
};

export const BFC_CCW: CommandParser = {
  match: /^0\sBFC\sCCW$/,
  parseLine: (state: State) => {
    state.winding = Winding.CCW;
    return true;
  },
};

export const BFC_INVERTNEXT: CommandParser = {
  match: /^0\sBFC\sINVERTNEXT$/,
  parseLine: (state: State) => {
    state.inverted = true;
    return true;
  },
};

export const BFC_NOCERTIFY: CommandParser = {
  match: /^0\s+BFC\s+NOCERTIFY$/,
  parseLine: (state: State) => {
    state.certified = false;
    return true;
  },
};

export const BFC: CommandParser = {
  match: /^0\s+BFC(.*)$/,

  parseLine: (state: State, { line, args }: ParsedCommand) => {
    if (!args[0]) {
      throw ParseError.InvalidLDrawFile(state);
    }
    state.certified = true; // Any BFC command besides NOCERTIFY is considered certified
    if (
      parseCommand(state, line, [
        BFC_CERTIFIY,
        BFC_CW,
        BFC_CCW,
        BFC_INVERTNEXT,
        BFC_NOCERTIFY,
      ])
    ) {
      return true;
    }

    // Error?
    const meta = new Meta({ lineNo: state.index + 1, line });
    state.files[state.files.length - 1].specs.push(meta);
    return true;
  },
};
