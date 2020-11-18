import { FileLine } from '../types';

//------------------------------------------------------------------------------
// Line Type 2: Line
//------------------------------------------------------------------------------

/**
 * Line type 2 is a line drawn between two points. The generic format is:
 *
 * 2 <colour> x1 y1 z1 x2 y2 z2
 *
 * Where:
 *   - <colour> is a number representing the colour of the part, typically this
 *     is 24 - the edge colour. See the Colours section for allowable colour
 *     numbers.
 *   - x1 y1 z1 is the coordinate of the first point
 *   - x2 y2 z2 is the coordinate of the second point
 *
 * Line type 2 (and also 5) is typically used to edge parts. When used in this
 * manner colour 24 must be used for the line. It should be remembered that not
 * all renderers display line types 2 and 5
 */
export class Line implements FileLine {
  static readonly lineType = 2;
  readonly lineType: number = Line.lineType;
  colour = 0;
  x1 = 0;
  y1 = 0;
  z1 = 0;
  x2 = 0;
  y2 = 0;
  z2 = 0;

  constructor(options?: Omit<Line, 'lineType'>) {
    Object.assign(this, options);
  }

  static parseTokens(tokens: string[]): Line {
    const line = new Line({
      colour: parseInt(tokens[1], 10),
      x1: parseFloat(tokens[2]),
      y1: parseFloat(tokens[3]),
      z1: parseFloat(tokens[4]),
      x2: parseFloat(tokens[5]),
      y2: parseFloat(tokens[6]),
      z2: parseFloat(tokens[7]),
    });
    return line;
  }
}
