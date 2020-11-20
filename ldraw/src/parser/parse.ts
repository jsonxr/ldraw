import { MpdFile } from '../MpdFile';
import { SingleFile } from '../SingleFile';
import { getInitialState, State } from './utils';
import { SINGLEFILE } from './parse-single';
import { MPDFILE } from './parse-mpd';
import { ParseError } from './ParseError';

const parseSingle = (state: State) => {
  state.files.push(new SingleFile()); // By spec, we know it's not an mpd
  SINGLEFILE(state);
  if (state.index < state.strings.length) {
    throw ParseError.InvalidLDrawFile(state);
  }
  return state.files[0];
};

/**
 * This simply scans for the very first real line.
 * MPD File must start with either of the following:
 *
 *     0 FILE
 *     0 !DATA
 *
 * It is a SingleFile if it doesn't start with either of the above
 *
 * When it knows which parser to use, it calls either
 * SINGLEFILE
 * @param state
 */
export const parse = (data: string): SingleFile | MpdFile | null => {
  const state = getInitialState(
    data
      .trim() // Remove beginning and leading strings
      .split(/\n/) // Split the string into an array of strings
  );

  let comment = false;

  // Should start with "0 FILE" or "0 !DATA" since we trimmed the file
  for (let i = 0; i < state.strings.length; i++) {
    const str = state.strings[i];
    if (str === '') {
      continue; // Skip blank lines
    }

    if (str.startsWith('0')) {
      if (str.startsWith('0 FILE') || str.startsWith('0 !DATA')) {
        MPDFILE(state);
        return new MpdFile({ files: state.files, data: state.data });
      } else {
        comment = true;
        continue; // It's a comment, ignore comments when trying to figure out
      }
    }

    if (['1', '2', '3', '4', '5'].includes(str[0])) {
      return parseSingle(state);
    }

    // It's a character that is not in 0-5, so error!
    throw ParseError.InvalidLDrawFile(state);
  }

  // We made it through the whole file and it is either all 0, or empty lines
  if (comment) {
    // We had at least one comment, so parse as a single file
    return parseSingle(state);
  } else {
    return null;
  }
};
