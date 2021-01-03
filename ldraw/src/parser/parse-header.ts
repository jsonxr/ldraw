import {
  State,
  parseStrings,
  ParsedCommand,
  parseNextLine,
  CommandParser,
  parseCommand,
} from './utils';
import { BFC } from './parse-0-meta-bfc';
import { CATEGORY, CMDLINE, HELP, HISTORY, KEYWORDS } from './parse-0-meta';
import { LDrawFileType } from '../LDrawFile';
import { CATEGORIES, Category } from '../Category';
import { Meta } from '../Meta';

/**
 *
 * LDraw files must start with the following header
 *
 * ```
 * 0 PartDescription
 * 0 Name: Filename.dat
 * 0 Author: RealName [UserName]
 * 0 !LDRAW_ORG Part| Subpart| Primitive| 8_Primitive| 48_Primitive| Shortcut (optional qualifier(s)) ORIGINAL|UPDATE YYYY-RR
 * or
 * 0 !LDRAW_ORG Unofficial_Part| Unofficial_Subpart| Unofficial_Primitive| Unofficial_8_Primitive| Unofficial_48_Primitive| Unofficial_Shortcut (optional qualifier(s))
 * 0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
 * or
 * 0 !LICENSE Not redistributable : see NonCAreadme.txt
 * ```
 *
 * Example:
 * ```
 * 0 Brick  2 x  4
 * 0 Name: 3001.dat
 * 0 Author: James Jessiman
 * 0 !LDRAW_ORG Part UPDATE 2004-03
 * 0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
 * ```
 */

export const META_NAME: CommandParser = {
  match: /^0\s+Name:\s+(.*)$/,
  parseLine: (state: State, { line, args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    file.name = args[0];
    return true;
  },
};

export const META_AUTHOR: CommandParser = {
  match: /^0\s+Author:\s+(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    file.meta.author = args[0];
    return true;
  },
};

export const META_LDRAW_ORG: CommandParser = {
  match: /^0\s+!LDRAW_ORG\s+(\S+)(.*)/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    file.type = args[0] as LDrawFileType;
    file.meta.update = args[1];
    return true;
  },
};

export const META_LICENSE: CommandParser = {
  match: /^0\s+!LICENSE\s+(.*)$/,
  parseLine: (state: State, { args }: ParsedCommand) => {
    const file = state.files[state.files.length - 1];
    file.meta.license = args[0];
    return true;
  },
};

export const HEADER_META = {
  match: /^0\s+/,
  parseLine: (state: State, { line }: ParsedCommand) => {
    const result = parseCommand(state, line, [
      META_NAME,
      META_AUTHOR,
      META_LDRAW_ORG,
      META_LICENSE,
      BFC,
      HISTORY,
      CATEGORY,
      KEYWORDS,
      CMDLINE,
      HELP,
    ]);

    // If we handled it with a command, add the meta
    if (result) {
      state.files[state.files.length - 1].commands.push(
        new Meta({ lineNo: state.index + 1, line: line })
      );
    }

    return result;
  },
};

export const HEADER = {
  process: (state: State): boolean => {
    // Chomp all the empty strings
    parseStrings(state, []);

    // 0 Brick  2 x  4
    const file = state.files[state.files.length - 1];
    parseNextLine(
      state,
      /^0\s+(\S*)(\s*)(.*)/,
      ({ line, args }: ParsedCommand) => {
        if (CATEGORIES.includes(args[0])) {
          file.meta.category = args[0] as Category;
          file.meta.description = args[2];
        } else {
          file.meta.description = args.join('');
        }
        state.files[state.files.length - 1].commands.push(
          new Meta({ lineNo: state.index + 1, line: line })
        );
      }
    );

    parseStrings(state, [HEADER_META]);
    return true;
  },
};
