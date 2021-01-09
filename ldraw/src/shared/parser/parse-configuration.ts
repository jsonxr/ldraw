import { State, parseStrings, ProcessorFn } from './utils';
import { COMMENT } from './parse-0-comment';
import { COLOUR } from './parse-0-meta-colour';

export const CONFIGURATION: ProcessorFn = (state: State) => {
  parseStrings(state, [COLOUR, COMMENT]);
};
