import { CommandParser, parseCommand, State } from './utils';
import { Meta } from '../Meta';

/**
 * https://www.ldraw.org/texmap-spec.html
 *
 *
 *
 * ```
 * 0 !TEXMAP (START | NEXT) <method> <parameters> <pngfile> [GLOSSMAP pngfile]
 * 0 !: <geometry1>
 * ...
 * <geometry2>
 * ...
 * 0 !TEXMAP FALLBACK
 * <geometry3>
 * ...
 * 0 !TEXMAP END
 * ```
 *
 * This is the main texture mapping meta-command.
 *
 * The START command indicates that the given texture should be used. (If
 * another texture is currently in use, it is pushed onto a stack for retrieval
 * when an END command is given.) This texture will remain in effect until:
 *
 *  - An END is given within the current file
 *  - The file in which the START is located ends
 *  - A STEP command is reached
 *
 * The texture will remain active when processing an included file unless
 * overridden within that file.
 *
 * Note: the FALLBACK section is always optional, although it is highly
 * recommended any time there is no geometry2 section.
 *
 * The FALLBACK command is a section marker. In a TEXMAP supporting application,
 * all geometry lines (whether following the 0 !: comment marker, or presented
 * as standard LDRAW geometry: geometry1 or geometry2 lines) between START and
 * FALLBACK are to be used as geometry and have the texture applied. All
 * geometry between FALLBACK and END are ignored. In applications that don't
 * support TEXMAP, nothing needs to be done, and all non-commented geometry is
 * generated as normal (though the LDRAW parts author should be very cautious
 * not to introduce unintended non-commented geometry lines into the START to
 * FALLBACK section).
 *
 *
 */

// 0 !TEXMAP START PLANAR 0 -34 -255 0 -34 34 0 500 -255 36069bp01.png
// 0 !: 1 16 -.25 0 0 -1 0 0 0 1 0 0 0 1 s\36069bs01.dat
// 0 !: 1 16 .25 0 0 1 0 0 0 1 0 0 0 1 s\36069bs01.dat
// 0 !TEXMAP FALLBACK

// 0 !HISTORY 2020-06-28 [PTadmin] Official Update 2020-01

// 1 16 -.25 0 0 -1 0 0 0 1 0 0 0 1 s\36069bp01s01.dat
// 1 16 .25 0 0 1 0 0 0 1 0 0 0 1 s\36069bp01s01.dat
// 0 !TEXMAP END

const addMeta = (state: State): boolean => {
  state.files[state.files.length - 1].commands.push(
    new Meta({
      type: 'TEXMAP',
      lineNo: state.index + 1,
      line: state.strings[state.index],
    })
  );
  return true;
};

export const TEXMAP_BANG: CommandParser = {
  match: /^0\s+!:\s+(.*)$/,
  parseLine: addMeta,
};

export const TEXMAP_FALLBACK: CommandParser = {
  match: /^0\s+!TEXMAP\s+FALLBACK/,
  parseLine: addMeta,
};

export const TEXMAP_END: CommandParser = {
  match: /^0\s+!TEXMAP\s+END/,
  parseLine: addMeta,
};

export const TEXMAP_START: CommandParser = {
  match: /^0\s+!TEXMAP\s+START\s*(.*)$/,
  parseLine: addMeta,
};

export const TEXMAP: CommandParser = {
  match: /^0\s!+TEXMAP\s+(.*)$/,
  parseLine: (state: State) => {
    // Ignore all TEXMAP commands
    const line = state.strings[state.index];
    const result = parseCommand(state, line, [
      TEXMAP_START,
      TEXMAP_END,
      TEXMAP_FALLBACK,
      TEXMAP_BANG,
    ]);
    return result;
  },
};
