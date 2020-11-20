export enum SpecType {
  BFC = 'BFC',
  META = 'META',
  TEXMAP = 'TEXMAP',
  COMMENT = 'COMMENT',
  LINE = 'LINE',
  OPTIONAL_LINE = 'OPTIONAL_LINE',
  QUAD = 'QUAD',
  SIMPLEANIM = 'SIMPLEANIM',
  SUBFILE = 'SUBFILE',
  TRIANGLE = 'TRIANGLE',
}

export interface Spec {
  type: SpecType;
  lineNo?: number;
}
