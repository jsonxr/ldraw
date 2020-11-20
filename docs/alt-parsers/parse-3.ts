import { State } from '../parser/parse-utils';
import { Comment } from '../Comment';

// Fake method calls
const required = (...o: any) => {};
const optional = (...o: any) => {};

// Fake referenced parse objects
const COMMENT = 0;
const FILE = 0;
const DATA = 1;
const BFC = 3;
const META = 4; // All commands that start with a !

interface CommandParserProps {
  match: string;
  args?: number;
  (state: State, tokens: string[]): boolean;
}

export const header: CommandParserProps = Object.assign(
  (state: State, tokens: string[]) => {
    // These need to be done before...
    required(state, () => {}); // 5 fixed header fields
    required(state, () => {});
    required(state, () => {});
    required(state, () => {});
    required(state, () => {});
    optional(state, [BFC, META, COMMENT]); // Process any number of optional children
    return true;
  },
  {
    match: '0',
    args: 14,
  }
);

export const comment: CommandParserProps = Object.assign(
  (state: State, tokens: string[]) => {
    const spec = new Comment({ tokens });
    state.files[state.files.length - 1].specs.push(spec);
    return true;
  },
  {
    match: '0',
    subcommands: [BFC, META], // Before we run the command, we try sub commands first
    exclude: [FILE, DATA], // If we match, we do NOT count this as being executed
    args: 14,
  }
);
