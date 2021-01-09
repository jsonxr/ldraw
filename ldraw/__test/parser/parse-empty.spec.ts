import { SingleFile } from '../../src/shared/SingleFile';
import { parse } from '../../src/shared/parser/parse';

describe('0 //', () => {
  it('should parse a comment after the header', () => {
    const str = `0 Brick  2 x  4
    0 Name: 3001.dat
    0 Author: James Jessiman
    0 !LDRAW_ORG Part UPDATE 2004-03
    0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

    0 BFC CERTIFY CCW

    0 !HISTORY 2002-05-07 [unknown] BFC Certification
    0 !HISTORY 2002-06-11 [PTadmin] Official Update 2002-03
    0 !HISTORY 2004-02-08 [Steffen] used s/3001s01.dat
    0 !HISTORY 2004-09-15 [PTadmin] Official Update 2004-03
    0 !HISTORY 2007-05-07 [PTadmin] Header formatted for Contributor Agreement
    0 !HISTORY 2008-07-01 [PTadmin] Official Update 2008-01

    1 16 0 0 0 1 0 0 0 1 0 0 0 1 s/3001s01.dat
    4 16 -40 0 -20 -40 24 -20 40 24 -20 40 0 -20
    4 16 40 0 20 40 24 20 -40 24 20 -40 0 20
    0
    `;
    const parsed = parse(str) as SingleFile;
    expect(parsed.commands?.length).toEqual(20);
    for (let i = 0; i < 20; i++) {
      expect(parsed.commands[i].lineNo).toEqual(i + 1);
    }
  });
});
