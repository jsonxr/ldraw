import { Command, CommandType } from './Command';

export type ColourFinish =
  | 'UNKNOWN'
  | 'CHROME'
  | 'PEARLESCENT'
  | 'RUBBER'
  | 'MATTE_METALLIC'
  | 'METAL'
  | 'MATERIAL';

export type ColourMaterial = {
  name: string;
  value: string; // 24 bit RGB #ffffff
  alpha?: number; // 0 - 255
  luminance?: number; //
  fraction?: number; // 0.0 - 1.0
  vfraction?: number; // 0.0 - 1.0
  minsize?: number; // LDraw units: 0 < minsize < maxsize
  maxsize?: number; // LDraw units: 0 < minsize < maxsize
  size?: number;
};

export const COLOUR_FINISHES = [
  'UNKNOWN',
  'CHROME',
  'PEARLESCENT',
  'RUBBER',
  'MATTE_METALLIC',
  'METAL',
  'MATERIAL',
];

/**
 *
 * 0 !COLOUR name CODE x VALUE v EDGE e [ALPHA a] [LUMINANCE l] [ CHROME |
 * PEARLESCENT | RUBBER | MATTE_METALLIC | METAL | MATERIAL <params> ]
 *
 *
 * 0                              // LEGOID 362 - Transparent Blue Opal
 * 0 !COLOUR Opal_Trans_Light_Blue                                 CODE 362   VALUE #AEE9EF   EDGE #59D1DE   ALPHA 200   LUMINANCE 5     MATERIAL GLITTER VALUE #59DEBF FRACTION 0.8 VFRACTION 0.6 MINSIZE 0.02 MAXSIZE 0.1
 *
 *
 */
export class Colour implements Command {
  type: CommandType = 'COLOUR';
  lineNo = 0;
  name = '';
  display?: string;
  legoId?: number;
  code = 0;
  value = '';
  edge = '';
  alpha?: number;
  luminance?: number;
  finish?: ColourFinish;
  material?: ColourMaterial;

  constructor(props?: Partial<Omit<Colour, 'type'>>) {
    Object.assign(this, props);
  }
}
