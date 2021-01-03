import { LDraw } from '../src/LDraw';
import { LDrawFile } from '../src/LDrawFile';
import { ParseError } from '../src/parser/ParseError';
import assets from './assets';

const header = assets('header.dat');

const populate = (ldraw: LDraw) => {
  ldraw.set('1.dat', {
    name: '1.dat',
    type: 'Part',
  } as LDrawFile);
  ldraw.set('2.dat', {
    name: '2.dat',
    type: 'Unofficial_Part',
  } as LDrawFile);
  ldraw.set('3.dat', {
    name: '3.dat',
    type: 'Model',
  } as LDrawFile);
};

describe('LDraw', () => {
  //let ldraw: LDraw;

  describe('new LDraw()', () => {
    it('should instantiate', () => {
      expect(new LDraw()).toBeTruthy();
    });

    it('should instantiate with props', () => {
      expect(new LDraw()).toBeTruthy();
    });
  });

  describe('.list', () => {
    it('should return list of files', () => {
      const ldraw = new LDraw();
      populate(ldraw);
      expect(Object.keys(ldraw.files)).toEqual(['1.dat', '2.dat', '3.dat']);
      expect(ldraw.files['1.dat']).toEqual({
        name: '1.dat',
        type: 'Part',
      });
    });
  });

  describe('.parts', () => {
    it('should return list of part files', () => {
      const ldraw = new LDraw();
      populate(ldraw);
      expect(ldraw.parts.length).toEqual(2);
      expect(ldraw.parts[0]).toEqual({
        name: '1.dat',
        type: 'Part',
      });
      expect(ldraw.parts[1]).toEqual({
        name: '2.dat',
        type: 'Unofficial_Part',
      });
    });
  });

  describe.only('.load', () => {
    it('should return null if it can not load file', async () => {
      const ldraw = new LDraw({ loaders: [jest.fn().mockResolvedValue(null)] });
      const value = await ldraw.load('fake');
      expect(value).toBeNull();
    });

    it('should return null and not cache if file loaded is not an LDrawFile', async () => {
      const error = new ParseError('Invalid LDraw file', {
        lineNo: 1,
        lines: ['xyz fake file'],
      });
      const ldraw = new LDraw({
        loaders: [jest.fn().mockRejectedValue(error)],
      });
      expect.assertions(1);
      try {
        await ldraw.load('fake.dat');
      } catch (err) {
        expect(err).toEqual(error);
      }
      //expect(ldraw.load('fake.dat')).rejects.toEqual(error);
    });

    it('should return parsed file if it finds', async () => {
      const ldraw = new LDraw({
        loaders: [
          jest
            .fn()
            .mockImplementation(async (filename: string) =>
              filename === 'fake.dat'
                ? `${header}\n1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat`
                : `${header}\n0 COMMENT`
            ),
        ],
      });
      const file = await ldraw.load('fake.dat');

      expect(file?.files.length).toEqual(1);
      expect(file?.files[0].name).toEqual('header.dat');
      expect(file?.files[0].filenames).toEqual(['819.dat']);
      // expect(ldraw.loaders[0]).toHaveBeenCalledWith('fake.dat');
      // expect(ldraw.loaders[0]).toHaveBeenCalledWith('819.dat');

      expect(ldraw.loaders[0]).toHaveBeenNthCalledWith(1, 'fake.dat');
      expect(ldraw.loaders[0]).toHaveBeenNthCalledWith(2, '819.dat');
    });

    it('should return object from cache if referenced by subfile', async () => {
      const ldraw = new LDraw({
        loaders: [
          jest
            .fn()
            .mockImplementation(async (filename: string) =>
              filename === 'fake.dat'
                ? `${header}\n1 16 1 2 3 4 5 6 7 8 9 10 11 12 3.dat`
                : `${header}\n0 COMMENT`
            ),
        ],
      });
      populate(ldraw);

      const file = await ldraw.load('fake.dat');
      expect(file?.files.length).toEqual(1);
      expect(file?.files[0].name).toEqual('header.dat');
      expect(file?.files[0].filenames).toEqual(['3.dat']);
      // Make sure it didn't call loadFile on 3.dat since it's in cache
      expect(ldraw.loaders[0]).toHaveBeenLastCalledWith('fake.dat');
    });

    it('should return null if it receives empty file from loadFile', async () => {
      const ldraw = new LDraw({
        loaders: [jest.fn().mockResolvedValue('\n\n')],
      });
      const file = await ldraw.load('fake.dat');
      expect(file).toBeNull();
    });

    it('should cache the files in an mpd', async () => {
      let count = 0;
      const ldraw = new LDraw({
        loaders: [
          jest.fn().mockImplementation(async (filename: string) => {
            if (count > 10) {
              return null;
            }
            count++;
            return filename === 'fake.dat' ? str : `${header}\n0 COMMENT`;
          }),
        ],
      });
      const str = `
        0 FILE main.ldr
        0 main
        0 Name: main.ldr
        0 Author: Part Author [theauthor]
        0 !LDRAW_ORG Model
        0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

        0 // 7 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat
        0 // 4 80 -8 70 1 0 0 0 1 0 0 0 1 house.ldr

        0 FILE house.ldr
        0 house
        0 Name: house.ldr
        0 Author: Part Author [theauthor]
        0 !LDRAW_ORG Model
        0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt

        0 // 16 0 0 0 1 0 0 0 1 0 0 0 1 3002.dat
        `;

      await ldraw.load('fake.dat', true);
      expect(Object.keys(ldraw.files)).toEqual([
        'fake.dat',
        'main.ldr',
        'house.ldr',
      ]);
    });

    it.skip('should only load a file once', () => {
      expect('').toEqual(`
      box5.dat gets loaded 3 times because we are using 6 requests

      models/10270 - Bookshop.mpd
      ============
      -> 14716.dat
      -> 16577.dat
      -> 22885.dat

      14716.dat
      =========
      box5.dat

      16577.dat
      =========
      box5.dat

      22885.dat
      =========
      box5.dat
      `);
    });
  });
});
