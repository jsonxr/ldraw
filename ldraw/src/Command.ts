export type CommandType =
  | 'BFC'
  | 'META'
  | 'TEXMAP'
  | 'COLOUR'
  | 'COMMENT'
  | 'EMPTY'
  | 'LINE'
  | 'OPTIONAL_LINE'
  | 'QUAD'
  | 'SIMPLEANIM'
  | 'SUBFILE'
  | 'TRIANGLE';

export const COMMANDTYPE_META: CommandType[] = [
  'BFC',
  'META',
  'TEXMAP',
  'COLOUR',
];

export interface Command {
  type: CommandType;
  lineNo: number;
}
