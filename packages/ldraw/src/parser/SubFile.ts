import { FileLine } from '../types';

//------------------------------------------------------------------------------
// Line Type 1: Sub-file reference
//------------------------------------------------------------------------------

/**
 * Line type 1 is a sub-file reference. The generic format is:
 *
 * `1 <colour> x y z a b c d e f g h i <file>`
 *
 * Where:
 *   - `<colour>` is a number representing the colour of the part.
 *   - `x y z` is the x y z coordinate of the part
 *   - `a b c d e f g h i` is a top left 3x3 matrix of a standard 4x4 homogeneous
 *     transformation matrix. This represents the rotation and scaling of
 *     the part. The entire 4x4 3D transformation matrix would then take either
 *     of the following forms:
 *
 *     ```
 *     / a d g 0 \   / a b c x \
 *     | b e h 0 |   | d e f y |
 *     | c f i 0 |   | g h i z |
 *     \ x y z 1 /   \ 0 0 0 1 /
 *     ```
 *
 *     The above two forms are essentially equivalent, but note the location of
 *     the transformation portion (x, y, z) relative to the other terms.
 *   - `<file>` is the filename of the sub-file referenced and must be a valid
 *     LDraw filename. Any leading and/or trailing whitespace must be ignored.
 *     Normal token separation is otherwise disabled for the filename value.
 *
 * Sub-files can be located in the
 *   - LDRAW\PARTS
 *   - LDRAW\P
 *   - LDRAW\MODELS
 *   - the current file's directory
 *
 *   - a path relative to one of these directories, or a full path may be specified.
 */
export class SubFile implements FileLine {
  static lineType = 1;
  readonly lineType: number = 1;
  inverted = false;
  animated = false;
  animatedName: string | undefined;
  file = '';
  colour = 0;
  x = 0;
  y = 0;
  z = 0;
  a = 0;
  b = 0;
  c = 0;
  d = 0;
  e = 0;
  f = 0;
  g = 0;
  h = 0;
  i = 0;

  constructor(options: Omit<SubFile, 'lineType'>) {
    Object.assign(this, options);
  }

  static parseTokens(
    tokens: string[],
    inverted: boolean,
    animated: boolean,
    animatedName: string | undefined
  ): SubFile {
    const file = tokens.slice(14).join(' ').toLowerCase().replace('\\', '/');
    const subFile = new SubFile({
      file: file,
      colour: parseInt(tokens[1], 10),
      inverted,
      animated,
      animatedName,
      x: parseFloat(tokens[2]),
      y: parseFloat(tokens[3]),
      z: parseFloat(tokens[4]),
      a: parseFloat(tokens[5]),
      b: parseFloat(tokens[6]),
      c: parseFloat(tokens[7]),
      d: parseFloat(tokens[8]),
      e: parseFloat(tokens[9]),
      f: parseFloat(tokens[10]),
      g: parseFloat(tokens[11]),
      h: parseFloat(tokens[12]),
      i: parseFloat(tokens[13]),
    });
    return subFile;
  }
}
