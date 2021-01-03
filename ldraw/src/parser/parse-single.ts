import { State, parseStrings, ProcessorFn, CommandParser } from './utils';
import { BFC } from './parse-0-meta-bfc';
import { HISTORY, META } from './parse-0-meta';
import { TEXMAP, TEXMAP_BANG } from './parse-0-meta-texmap';
import { COMMENT } from './parse-0-comment';
import { SUBFILE } from './parse-1-subfile';
import { LINE } from './parse-2-line';
import { TRIANGLE } from './parse-3-triangle';
import { QUAD } from './parse-4-quad';
import { OPTIONAL_LINE } from './parse-5-optionalline';
import { HEADER } from './parse-header';
import { CONFIGURATION } from './parse-configuration';

export const SINGLEFILE: ProcessorFn = (state: State) => {
  const file = state.files[state.files.length - 1];
  const start = state.index;
  HEADER.process(state);
  if (file.type === 'Configuration') {
    CONFIGURATION(state);
  } else {
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
  }
  const stop = state.index;
  file.text = state.strings.slice(start, stop).join('\n');
};
