import { State, parseStrings, ProcessorFn } from './utils';
import { BFC } from './parse-0-meta-bfc';
import {
  CATEGORY,
  CMDLINE,
  HELP,
  HISTORY,
  KEYWORDS,
  META,
} from './parse-0-meta';
import { TEXMAP, TEXMAP_BANG } from './parse-0-meta-texmap';
import { COMMENT } from './parse-0-comment';
import { SUBFILE } from './parse-1-subfile';
import { LINE } from './parse-2-line';
import { TRIANGLE } from './parse-3-triangle';
import { QUAD } from './parse-4-quad';
import { OPTIONAL_LINE } from './parse-5-optionalline';
import { ParseError } from './ParseError';
import { LDrawFileType } from '../LDrawFile';

/**
 *
 * LDraw files must start with the following header
 *
 * ```
 * 0 Complete
 * 0 Name: 10270 - Complete.ldr
 * 0 Author: Ulrich Röder [UR]
 * 0 !LDRAW_ORG Model
 * 0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
 * ```
 */
const HEADER = {
  process: (state: State): boolean => {
    if (state.index + 5 > state.strings.length) {
      throw ParseError.InvalidLDrawFile(state);
    }

    const getTokens = (i: number) =>
      state.strings[state.index + i].split(/\s+/);

    const file = state.files[state.files.length - 1];
    file.meta.description = getTokens(0).slice(1).join(' ');
    file.name = getTokens(1)
      .slice(2)
      .join(' ')
      .replaceAll('\\', '/')
      .toLowerCase();
    file.meta.author = getTokens(2).slice(2).join(' ');

    file.type = getTokens(3)[2] as LDrawFileType;
    file.meta.update = getTokens(3).slice(3).join(' ');
    file.meta.license = getTokens(4).slice(2).join(' ');
    state.index = state.index + 5;

    parseStrings(state, [BFC, HISTORY, CATEGORY, KEYWORDS, CMDLINE, HELP]);

    return true;
  },
};

export const SINGLEFILE: ProcessorFn = (state: State) => {
  const start = state.index;
  HEADER.process(state);
  parseStrings(state, [
    BFC,
    TEXMAP,
    TEXMAP_BANG,
    HISTORY,
    META,
    // Comment has to come after all meta commands
    COMMENT,
    SUBFILE,
    LINE,
    TRIANGLE,
    QUAD,
    OPTIONAL_LINE,
  ]);
  const stop = state.index;
  state.files[state.files.length - 1].text = state.strings
    .slice(start, stop)
    .join('\n');
};
