interface LineState {
  index: number;
  strings: string[];
}
export class ParseError extends Error {
  lineNo?: number;
  lines?: string[];
  constructor(
    message = 'Invalid LDraw file',
    props?: Pick<ParseError, 'lineNo' | 'lines'>
  ) {
    if (props?.lineNo === undefined || !props?.lines) {
      super(message);
      return;
    }

    const lines = props.lines.map((s: string) => s.trim());
    const linesWithLineNo = lines
      .map((s: string, i: number) => `${i + 1}: ${s}`)
      .join('\n');
    const errorMessage = `${message} - line ${props.lineNo}:\n\n${linesWithLineNo}\n\n`;
    super(errorMessage);
    this.lineNo = props.lineNo;
    this.lines = lines;
  }

  static InvalidLDrawFile(state: LineState): ParseError {
    return new ParseError('Invalid LDraw file', {
      lineNo: state.index + 1,
      lines: state.strings,
    });
  }
}
