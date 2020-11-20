import { LDraw } from '../src/LDraw';
import { LDrawFile, LDrawFileType } from '../src/LDrawFile';
import { ParseError } from '../src/parser';
import assets from './assets';

const header = assets('header.dat');

describe('LDraw', () => {
  let ldraw: LDraw;
  beforeEach(() => {
    ldraw = new LDraw();
    ldraw.cache.set('1.dat', {
      name: '1.dat',
      type: LDrawFileType.Part,
    } as LDrawFile);
    ldraw.cache.set('2.dat', {
      name: '2.dat',
      type: LDrawFileType.Unofficial_Part,
    } as LDrawFile);
    ldraw.cache.set('3.dat', {
      name: '3.dat',
      type: LDrawFileType.Model,
    } as LDrawFile);
  });

  describe('new LDraw()', () => {
    it('should instantiate', () => {
      expect(new LDraw()).toBeTruthy();
    });

    it('should instantiate with props', () => {
      expect(new LDraw({ folders: ['/parts'] })).toBeTruthy();
    });
  });

  describe('.list', () => {
    it('should return list of files', () => {
      expect(Object.keys(ldraw.list)).toEqual(['1.dat', '2.dat', '3.dat']);
      expect(ldraw.list['1.dat']).toEqual({
        name: '1.dat',
        type: LDrawFileType.Part,
      });
    });
  });

  describe('.parts', () => {
    it('should return list of part files', () => {
      expect(ldraw.parts.length).toEqual(2);
      expect(ldraw.parts[0]).toEqual({
        name: '1.dat',
        type: LDrawFileType.Part,
      });
      expect(ldraw.parts[1]).toEqual({
        name: '2.dat',
        type: LDrawFileType.Unofficial_Part,
      });
    });
  });

  describe('.load', () => {
    it('should return null if it can not load file', async () => {
      ldraw.loadFile = jest.fn().mockResolvedValue(undefined);
      const value = await ldraw.load('fake');
      expect(value).toBeNull();
    });

    it('should return null and not cache if file loaded is not an LDrawFile', async () => {
      const error = new ParseError('Invalid LDraw file', {
        lineNo: 1,
        lines: ['xyz fake file'],
      });
      ldraw.loadFile = jest.fn().mockResolvedValue('xyz fake file');
      expect.assertions(1);
      return expect(ldraw.load('fake.dat')).rejects.toEqual(error);
    });

    it('should return parsed file if it finds', async () => {
      ldraw.loadFile = jest
        .fn()
        .mockImplementation(async (filename: string) =>
          (await filename) === 'fake.dat'
            ? `${header}\n1 16 1 2 3 4 5 6 7 8 9 10 11 12 819.dat`
            : `${header}\n0 COMMENT`
        );
      const file = await ldraw.load('fake.dat');
      expect(file?.files.length).toEqual(1);
      expect(file?.files[0].name).toEqual('header.dat');
      expect(file?.files[0].filenames).toEqual(['819.dat']);
      expect(ldraw.loadFile).toHaveBeenNthCalledWith(1, 'fake.dat');
      expect(ldraw.loadFile).toHaveBeenNthCalledWith(2, '/parts/819.dat');
    });

    it('should return object from cache if referenced by subfile', async () => {
      ldraw.loadFile = jest
        .fn()
        .mockImplementation(async (filename: string) =>
          (await filename) === 'fake.dat'
            ? `${header}\n1 16 1 2 3 4 5 6 7 8 9 10 11 12 3.dat`
            : `${header}\n0 COMMENT`
        );
      const file = await ldraw.load('fake.dat');
      expect(file?.files.length).toEqual(1);
      expect(file?.files[0].name).toEqual('header.dat');
      expect(file?.files[0].filenames).toEqual(['3.dat']);
      // Make sure it didn't call loadFile on 3.dat since it's in cache
      expect(ldraw.loadFile).toHaveBeenLastCalledWith('fake.dat');
    });

    it('should return null if it receives empty file from loadFile', async () => {
      ldraw.loadFile = jest.fn().mockResolvedValue('\n\n');
      const file = await ldraw.load('fake.dat');
      expect(file).toBeNull();
    });
  });

  describe('.find', () => {
    it('should not care if folder has a / on end or not', async () => {
      ldraw = new LDraw({
        folders: ['/parts', '/p/'],
        loadFile: jest.fn().mockReturnValue(null),
      });
      await ldraw.find('a.dat');
      expect(ldraw.loadFile).toHaveBeenNthCalledWith(1, '/parts/a.dat');
      expect(ldraw.loadFile).toHaveBeenNthCalledWith(2, '/p/a.dat');
    });
    it('should convert "\\" to "/"', async () => {
      ldraw = new LDraw({
        folders: ['\\parts'],
        loadFile: jest.fn().mockReturnValue(null),
      });
      await ldraw.find('a.dat');
      expect(ldraw.loadFile).toHaveBeenCalledWith('/parts/a.dat');
    });
  });
});
