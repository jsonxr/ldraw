import { FileLine } from '../types';

//------------------------------------------------------------------------------
// Line Type 5: Optional Line
//------------------------------------------------------------------------------

export class OptionalLine implements FileLine {
  static readonly lineType = 5;
  readonly lineType = OptionalLine.lineType;
  colour = 0;
  x1 = 0;
  y1 = 0;
  z1 = 0;
  x2 = 0;
  y2 = 0;
  z2 = 0;
  x3 = 0;
  y3 = 0;
  z3 = 0;
  x4 = 0;
  y4 = 0;
  z4 = 0;

  constructor(options?: Omit<OptionalLine, 'lineType'>) {
    Object.assign(this, options);
  }

  static parseTokens(tokens: string[]): OptionalLine {
    const optionalLine = new OptionalLine({
      colour: parseInt(tokens[1], 10),
      x1: parseFloat(tokens[2]),
      y1: parseFloat(tokens[3]),
      z1: parseFloat(tokens[4]),
      x2: parseFloat(tokens[5]),
      y2: parseFloat(tokens[6]),
      z2: parseFloat(tokens[7]),
      x3: parseFloat(tokens[8]),
      y3: parseFloat(tokens[9]),
      z3: parseFloat(tokens[10]),
      x4: parseFloat(tokens[11]),
      y4: parseFloat(tokens[12]),
      z4: parseFloat(tokens[13]),
    });
    return optionalLine;
  }
}
