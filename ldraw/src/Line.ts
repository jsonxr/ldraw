import { Spec, SpecType } from './Spec';

//------------------------------------------------------------------------------
// Line Type 2: Line
//------------------------------------------------------------------------------

/**
 * Line type 2 is a line drawn between two points. The generic format is:
 *
 * `2 <colour> x1 y1 z1 x2 y2 z2`
 *
 * Where:
 *   - `<colour>` is a number representing the colour of the part, typically this
 *     is 24 - the edge colour. See the Colours section for allowable colour
 *     numbers.
 *   - `x1 y1 z1` is the coordinate of the first point
 *   - `x2 y2 z2` is the coordinate of the second point
 *
 * Line type 2 (and also 5) is typically used to edge parts. When used in this
 * manner colour 24 must be used for the line. It should be remembered that not
 * all renderers display line types 2 and 5
 */
export class Line implements Spec {
  lineNo = -1;
  type = SpecType.LINE;
  colour = 0;
  x1 = 0;
  y1 = 0;
  z1 = 0;
  x2 = 0;
  y2 = 0;
  z2 = 0;

  constructor(props?: Omit<Line, 'type'>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
