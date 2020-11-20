import { Data } from '../Data';
import { SingleFile } from '../SingleFile';
import { Winding } from '../Winding';

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
  winding: Winding.CCW,
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
export interface CommandParser {
  match: RegExp;
  args?: number;
  parseLine: (state: State, command: ParsedCommand) => boolean;
}

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
