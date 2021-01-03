import { Command, CommandType } from './Command';
import { Winding } from './Winding';

//------------------------------------------------------------------------------
// Line Type 4: Quadrilateral
//------------------------------------------------------------------------------

/**
 *
 * Line type 4 is a filled quadrilateral (also known as a "quad") drawn between
 * four points. The generic format is:
 *
 * 4 <colour> x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4
 *
 * Where:
 *   - <colour> is a number representing the colour of the part. See the Colours
 *     section for allowable colour numbers.
 *   - x1 y1 z1 is the coordinate of the first point
 *   - x2 y2 z2 is the coordinate of the second point
 *   - x3 y3 z3 is the coordinate of the third point
 *   - x4 y4 z4 is the coordinate of the fourth point
 */
export class Quad implements Command {
  lineNo = -1;
  type: CommandType = 'QUAD';
  winding: Winding = 'CCW';
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
  x4 = 0;
  y4 = 0;
  z4 = 0;
  constructor(props?: Partial<Omit<Quad, 'type'>>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
