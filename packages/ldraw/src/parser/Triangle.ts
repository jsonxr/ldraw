import { FileLine } from '../types';

//------------------------------------------------------------------------------
// Line Type 3: Triangle
//------------------------------------------------------------------------------

/**
 * Line type 3 is a filled triangle drawn between three points. The generic
 * format is:
 *
 * 3 <colour> x1 y1 z1 x2 y2 z2 x3 y3 z3
 *
 * Where:
 *   - <colour> is a number representing the colour of the part. See the
 *     Colours section for allowable colour numbers.
 *   - x1 y1 z1 is the coordinate of the first point
 *   - x2 y2 z2 is the coordinate of the second point
 *   - x3 y3 z3 is the coordinate of the third point
 *
 * See also the comments about polygons at the end of the Line Type 4 section.
 */
export class Triangle implements FileLine {
  static readonly lineType = 3;
  readonly lineType = Triangle.lineType;
  ccw = false;
  certified = false;
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

  constructor(options?: Omit<Triangle, 'lineType'>) {
    Object.assign(this, options);
  }

  static parseTokens(tokens: string[], ccw: boolean, certified: boolean): Triangle {
    const triangle = new Triangle({
      ccw,
      certified,
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
    });
    return triangle;
  }
}
