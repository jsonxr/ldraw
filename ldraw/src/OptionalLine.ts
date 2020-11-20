import { Spec, SpecType } from './Spec';

//------------------------------------------------------------------------------
// Line Type 5: Optional Line
//------------------------------------------------------------------------------
/**
 * Line type 5 is an optional line. The generic format is:
 *
 * `5 <colour> x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4`
 *
 * Where:
 *   - `<colour>` is a number representing the colour of the part, typically
 *      this is 24 - the edge colour. See the Colours section for allowable
 *      colour numbers.
 *   - `x1 y1 z1` is the coordinate of the first point
 *   - `x2 y2 z2` is the coordinate of the second point
 *   - `x3 y3 z3` is the coordinate of the first control point
 *   - `x4 y4 z4` is the coordinate of the second control point
 *
 * With an optional line, a line between the first two points will only be drawn
 * if the projections of the last two points (the control points) onto the
 * screen are on the same side of an imaginary line through the projections of
 * the first two points onto the screen.
 *
 * The optional line can be a difficult concept to grasp. The best way to
 * demonstrate how they work is through a picture.
 *
 * ![Optional Line](https://www.ldraw.org/uploads/images/Articles/opline.gif)
 *
 * `5 24 Bx By Bz Ex Ey Ez Ax Ay Az Cx Cy Cz`
 *
 * `A` and `C` are on the same side of the green line through `BE`, so `BE` is
 * drawn.
 *
 * `5 24 Cx Cy Cz Fx Fy Fz Bx By Bz Dx Dy Dz`
 *
 * `B` and `D` are not on the same side of the red line through `CF`, so `CF` is
 * not drawn.
 *
 * This serves to "outline" the edges of the curved surface, which is the intent
 * of optional lines.
 *
 * As seen above, the control points usually can be choosen from already known
 * points in the object. Since they are never drawn, they can be located
 * anywhere, as long as they have the right controlling properties.
 *
 * Optional lines have the same colour rules as normal lines (Line Type 2)
 */
export class OptionalLine implements Spec {
  type = SpecType.OPTIONAL_LINE;
  lineNo = -1;
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
  constructor(props?: Partial<Omit<OptionalLine, 'type'>>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
