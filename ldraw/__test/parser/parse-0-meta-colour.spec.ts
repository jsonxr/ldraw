import { SingleFile } from '../../src/shared/SingleFile';
import { parse } from '../../src/shared/parser/parse';
import { getColours } from '../../src/shared/Colours';

describe('0 !COLOUR', () => {
  it('should parse basic', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LDraw Solid Colours
      0 // LEGOID  23 - Bright Blue
      0 !COLOUR Blue CODE   1   VALUE #1E5AA8   EDGE #333333
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(9);
    const colour = parsed.colours[0];
    expect(colour.name).toEqual('Blue');
    expect(colour.display).toEqual('Bright Blue');
    expect(colour.code).toEqual(1);
    expect(colour.legoId).toEqual(23);
    expect(colour.value).toEqual('#1E5AA8');
    expect(colour.edge).toEqual('#333333');
    expect(colour.alpha).toBeUndefined();
    expect(colour.luminance).toBeUndefined();
    expect(colour.material).toBeUndefined();
  });

  it('should parse alpha', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID  20 - Nature
      0 !COLOUR Milky_White CODE  79   VALUE #EEEEEE   EDGE #BABABA   ALPHA 240
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(8);
    const colour = parsed.colours[0];
    expect(colour.alpha).toEqual(240);
  });

  it('should parse lumniescence', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID 294 - Phosphorescent Green
      0 !COLOUR Glow_In_Dark_Opaque CODE  21   VALUE #E0FFB0   EDGE #B8FF4D   ALPHA 240   LUMINANCE 15
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(8);
    const colour = parsed.colours[0];
    expect(colour.luminance).toEqual(15);
  });

  it('should parse simple finishes', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11

      0 // LDraw Solid Colours
      0                              // LEGOID 186 - Metallic Dark Green
      0 !COLOUR Metallic_Dark_Green                                   CODE 186   VALUE #008E3C   EDGE #333333                               METAL
      0                              // LEGOID 183 - Metallic White
      0 !COLOUR Pearl_White                                           CODE 183   VALUE #F6F2DF   EDGE #333333                               PEARLESCENT
      0                              // LEGOID 310 - Metalized Gold
      0 !COLOUR Chrome_Gold                                           CODE 334   VALUE #DFC176   EDGE #C2982E                               CHROME
      0 !COLOUR Rubber_Yellow                                         CODE  65   VALUE #FAC80A   EDGE #333333                               RUBBER
      0 !COLOUR Rubber_Yellow                                         CODE  65   VALUE #FAC80A   EDGE #333333                               MATTE_METALLIC
      0                              // LEGOID 132 - Black Glitter
      0 !COLOUR Speckle_Black_Gold                                    CODE 133   VALUE #000000   EDGE #DBAC34                               MATERIAL SPECKLE VALUE #DBAC34 FRACTION 0.4 MINSIZE 1 MAXSIZE 3
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(18);
    expect(parsed.commands[0].type).toEqual('EMPTY');
    expect(parsed.commands[5].type).toEqual('EMPTY');
    expect(parsed.commands[17].type).toEqual('EMPTY');
    expect(parsed.colours[0].finish).toEqual('METAL');
    expect(parsed.colours[1].finish).toEqual('PEARLESCENT');
    expect(parsed.colours[2].finish).toEqual('CHROME');
    expect(parsed.colours[3].finish).toEqual('RUBBER');
    expect(parsed.colours[4].finish).toEqual('MATTE_METALLIC');
  });

  it('should parse material with minsize/maxsize', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID 132 - Black Glitter
      0 !COLOUR Speckle_Black_Gold CODE 133 VALUE #000000 EDGE #DBAC34 MATERIAL SPECKLE VALUE #DBAC34 LUMINANCE 5 ALPHA 100 FRACTION 0.4 MINSIZE 1 MAXSIZE 3
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(8);
    expect(parsed.colours.length).toEqual(1);
    const colour = parsed.colours[0];
    expect(colour.finish).toBeTruthy();
    expect(colour.finish).toEqual('MATERIAL');
    expect(colour.material).toBeTruthy();
    expect(colour.material?.name).toEqual('SPECKLE');
    expect(colour.material?.value).toEqual('#DBAC34');
    expect(colour.material?.alpha).toEqual(100);
    expect(colour.material?.luminance).toEqual(5);
    expect(colour.material?.fraction).toBeCloseTo(0.4);
    expect(colour.material?.minsize).toBeCloseTo(1);
    expect(colour.material?.maxsize).toBeCloseTo(3);
  });

  it('should handle a colour without a finish', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID 186 - Metallic Dark Green
      0 !COLOUR Metallic_Dark_Green CODE 186 VALUE #008E3C EDGE #333333
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed).toBeTruthy();
    expect(parsed.commands.length).toEqual(8);
    expect(parsed.colours.length).toEqual(1);
    const colour = parsed.colours[0];
    expect(colour.finish).toBeFalsy();
  });

  it('should throw error on an invalid finish', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID 186 - Metallic Dark Green
      0 !COLOUR Metallic_Dark_Green CODE 186   VALUE #008E3C   EDGE #333333  FAKE
    `;
    // const parsed =
    // console.log(parsed);
    expect.assertions(1);
    expect(() => {
      parse(str) as SingleFile;
    }).toThrow();
    //    expect((parsed.specs[1] as Colour).finish).toBeFalsy();
  });

  it('should parse material with size', () => {
    const str = `
      0 LDraw.org Configuration File
      0 Name: LDConfig.ldr
      0 Author: LDraw.org
      0 !LDRAW_ORG Configuration UPDATE 2020-05-11
      0 // LEGOID 132 - Black Glitter
      0 !COLOUR Speckle_Black_Gold CODE 133 VALUE #000000 EDGE #DBAC34 MATERIAL SPECKLE VALUE #DBAC34 LUMINANCE 5 ALPHA 100 FRACTION 0.4 SIZE 1
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed.commands.length).toEqual(8);
    expect(parsed.colours.length).toEqual(1);
    const colour = parsed.colours[0];
    expect(colour.finish).toBeTruthy();
    expect(colour.finish).toEqual('MATERIAL');
    expect(colour.material).toBeTruthy();
    expect(colour.material?.name).toEqual('SPECKLE');
    expect(colour.material?.value).toEqual('#DBAC34');
    expect(colour.material?.alpha).toEqual(100);
    expect(colour.material?.luminance).toEqual(5);
    expect(colour.material?.fraction).toBeCloseTo(0.4);
    expect(colour.material?.size).toBeCloseTo(1);
  });

  it('should parse vfraction, fraction, size', () => {
    const str = `
    0 LDraw.org Configuration File
    0 Name: LDConfig.ldr
    0 Author: LDraw.org
    0 !LDRAW_ORG Configuration UPDATE 2020-05-11
    0 // LEGOID 114 - Tr. Medium Reddish-Violet w. Glitter 2%
    0 !COLOUR Glitter_Trans_Dark_Pink CODE 114 VALUE #DF6695 EDGE #B9275F ALPHA 128 MATERIAL GLITTER VALUE #B92790 FRACTION 0.17 VFRACTION 0.2 SIZE 1
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed.commands.length).toEqual(8);
    expect(parsed.colours.length).toEqual(1);
    const colour = parsed.colours[0];
    expect(colour.finish).toBeTruthy();
    expect(colour.finish).toEqual('MATERIAL');
    expect(colour.material).toBeTruthy();
    expect(colour.material?.name).toEqual('GLITTER');
    expect(colour.material?.fraction).toBeCloseTo(0.17);
    expect(colour.material?.vfraction).toBeCloseTo(0.2);
    expect(colour.material?.size).toBeCloseTo(1);
  });

  it('should have default colours', () => {
    const colours = getColours();
    expect(colours.length).toBeTruthy();
  });
});
