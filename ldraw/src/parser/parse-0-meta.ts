import { Meta } from '../Meta';
import { Category } from '../Category';
import { CommandParser, parseCommand, ParsedCommand, State } from './utils';

export const CMDLINE: CommandParser = {
  match: /^0\s+!CMDLINE\s*(.*)$/,
  parseLine: () => {
    return true; // We don't handle this
  },
};

export const LDCAD: CommandParser = {
  match: /^0\s+!LDCAD\s*(.*)$/,
  parseLine: () => {
    return true; // We don't handle this
  },
};

export const THEME: CommandParser = {
  match: /^0\s+!THEME\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    file.meta.theme = args[0].trim();
    return true;
  },
};

export const HISTORY: CommandParser = {
  match: /^0\s+!HISTORY\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const history = file.meta.history ?? [];
    history.push(args[0].trim());
    file.meta.history = history;
    return true;
  },
};

export const HELP: CommandParser = {
  match: /^0\s+!HELP\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    const help = file.meta.help ?? [];
    help.push(args[0].trim());
    file.meta.help = help;
    return true;
  },
};

export const CATEGORY: CommandParser = {
  match: /^0\s+!CATEGORY\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    // We can only have one CATEGORY, so just ignore if it has one already
    if (!file.meta.category) {
      const category = args[0].trim();
      file.meta.category = (category as unknown) as Category;
    } else {
      // category already exists
      // throw ParseError.InvalidLDrawFile(state);
    }
    return true;
  },
};

export const KEYWORDS: CommandParser = {
  match: /^0\s+!KEYWORDS\s*(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    let keywords = file.meta.keywords ?? [];
    const k = args[0]
      // Split the string on commas
      .split(',')
      // Trim each keyword
      .map((s) => s.trim())
      // Get rid of any empties like two commas in a row, or a trailing comma
      .filter((s) => s);
    keywords = keywords.concat(k);
    file.meta.keywords = keywords;
    return true;
  },
};

export const META: CommandParser = {
  match: /^0\s+!(\S+)/,

  parseLine: (state: State, { line, args }: ParsedCommand) => {
    parseCommand(state, line, [
      KEYWORDS,
      CATEGORY,
      HELP,
      HISTORY,
      LDCAD,
      CMDLINE,
      THEME,
    ]);

    // We don't know what this meta command is, so add to the current spec
    //if (!result) {
    // Always add a Meta in the commands
    state.files[state.files.length - 1].commands.push(
      new Meta({ lineNo: state.index + 1, line: line })
    );
    //}

    // Special case code because these are not meant to be in a single file
    if (['FILE', 'NOFILE', 'DATA'].includes(args[0])) {
      return false;
    }
    return true;
  },
};
