import { Data } from '../Data';
import { Empty } from '../Empty';
import { SingleFile } from '../SingleFile';
import { Winding } from '../Winding';
import { ParseError } from './ParseError';

export interface ParserState {
  index: number;
  strings: string[];
}

export interface State extends ParserState {
  // Parsing state
  // animated: boolean;
  // animatedName?: string;
  winding: Winding;
  certified: boolean;
  cull: boolean;
  inverted: boolean;
  //textures: TextureMap[];
  // outcome
  files: SingleFile[];
  data: Data[];
}

export const getInitialState = (strings: string[] = []): State => ({
  //animated: false,
  winding: 'CCW',
  certified: false,
  cull: false,
  index: 0,
  inverted: false,
  strings: strings.map((s) => s.trim()),

  files: [],
  data: [],
});

export interface ParsedCommand {
  line: string;
  args: string[];
}

export interface CommandMatcher {
  match: RegExp;
}

export type ParseLine = (state: State, command: ParsedCommand) => boolean;

export interface CommandParser extends CommandMatcher {
  parseLine: ParseLine;
}

// Optionall parse this line if it matches
export const parseLine = (
  line: string,
  match: RegExp,
  fn: (cmd: ParsedCommand) => void
): boolean => {
  const matches = line.match(match);
  if (matches) {
    const args = matches.slice(1);
    fn({ line, args });
    return true;
  } else {
    return false;
  }
};

// parse the next line and throw if it doesn't match. advance to next line if it
// does
export const parseNextLine = (
  state: State,
  match: RegExp,
  fn: (cmd: ParsedCommand) => void
): void => {
  const line = state.strings[state.index];
  const matches = line.match(match);
  if (matches) {
    const args = matches.slice(1);
    fn({ line, args });
    state.index++;
  } else {
    throw ParseError.InvalidLDrawFile(state);
  }
};

export type ProcessorFn = (state: State) => void;

/**
 * This will attempt to process the line given an array of LineParsers
 * It will remove the first token, and pass the remaining tokens to
 * child node processors.
 *
 * Example:
 * 0 BFC CCW
 *
 * This parses like:
 *
 *    SINGLEFILE: tokens = ["0","BFC","CCW"]
 *    COMMENT: tokens = ["BFC","CCW"]
 *    BFC: tokens = ["CCW"]
 *
 * When SINGFILE is parsing, it will match on the "0" for a Comment.
 * Comment will then match the "BFC" for the BFC node
 * The BFC node will match "CCW" to perform it's state update
 *
 *
 * @param state State
 * @param tokens string[]
 * @param commands LineParser[] - List of child
 */
export const parseCommand = (
  state: State,
  line: string,
  commands: CommandParser[]
): boolean => {
  // Look at all our nodes for matching commands, return when we find a match
  for (const node of commands) {
    const matches = line.match(node.match);
    if (matches) {
      const args = matches.slice(1);
      // Found our match, now parse the line
      const parsed = node.parseLine(state, { line, args });
      return parsed;
    }
  }
  return false;
};

/**
 * This will consume commands from a line using regex matching
 *
 * 0 !COLOUR name CODE x VALUE v EDGE e [ALPHA a] [LUMINANCE l] [ CHROME |
 * PEARLESCENT | RUBBER | MATTE_METALLIC | METAL | MATERIAL <params> ]
 *
 * It starts by trying to match from a list:
 * /^0 !COLOUR name CODE x VALUE v EDGE e/
 * /^ALPHA a/
 * /^LUMINANCE l/
 * /^PEARL|RUBB|MATT|etc.../
 *
 * It will match as much as it can and then chomp it off and try again with a shorter string
 * so, iterations on the above strings look like this:
 *
 * 1 - "0 !COLOUR name CODE x VALUE v EDGE e ALPHA a LUMINANCE l MATERIAL xyz"
 * 2 - "ALPHA a LUMINANCE l MATERIAL xyz"
 * 3 - "LUMINANCE l MATERIAL xyz"
 * 4 - "MATERIAL xyz"
 *
 *
 * @param state
 * @param line
 * @param commands
 */
export const chompCommands = (
  state: State,
  line: string,
  commands: CommandParser[]
): string | null => {
  // Look at all our nodes for matching commands, return when we find a match
  let nextline: string = line;
  let keepChomping = true;
  let lastline = '';
  let lastmatch;
  while (nextline && keepChomping) {
    lastline = nextline;
    keepChomping = false;
    for (const node of commands) {
      const matches = nextline.match(node.match);
      if (!matches) {
        continue;
      }

      // We have a match, now make sure it matched actual characters
      if (matches[0].length === 0) {
        throw new Error(
          `Match MUST match at least some characters: match=${lastmatch} last="${lastline}" nextline="${nextline}"`
        );
      }

      lastmatch = node.match;
      const args = matches.slice(1);
      // Found our match, now parse the line
      node.parseLine(state, { line, args });
      // Get the remaining string
      const index = nextline.indexOf(matches[0]);
      nextline = (
        nextline.substr(0, index) + nextline.substr(index + matches[0].length)
      ).trim();
      keepChomping = true;
      break;
    }
  }

  if (nextline) {
    return nextline;
  }

  return null;
};

/**
 * Given a list of nodes and a line, it will return the first matching parser
 * @param line
 * @param commands
 */
export const findCommand = (
  line: string,
  commands: CommandMatcher[]
): CommandMatcher | null => {
  for (const node of commands) {
    const matches = line.match(node.match);
    if (matches) {
      return node;
    }
  }
  return null;
};

/**
 * This check each string for a match of nodes.
 * If it finds a match, it will process that line.
 * If it doesn't find a match, the function will abort any further processing
 *
 * @param state
 * @param nodes - Possible nodes to process
 */
export const parseStrings = (state: State, nodes: CommandParser[]): boolean => {
  while (state.index < state.strings.length) {
    // As long as we have strings to process and we haven't failed yet, keep on processing
    const str = state.strings[state.index];
    if (!str) {
      if (state.files?.length) {
        if (state.index === 14) {
          //throw new Error('stop');
        }
        state.files[state.files.length - 1].commands.push(
          new Empty({ lineNo: state.index + 1 })
        );
      }
      state.index++;
      continue;
    }

    //const tokens = str.split(/\s+/);
    const parsed = parseCommand(state, str, nodes);
    if (parsed) {
      state.index++;
    } else {
      return false; // Stop processing any more nodes
    }
  }

  return true;
};
