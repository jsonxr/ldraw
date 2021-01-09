import { SubFile } from '../src/shared/SubFile';

describe('SubFile', () => {
  it('should have a default constructor', () => {
    const subfile = new SubFile();
    expect(subfile.colour).toEqual(0);
    expect(subfile.x).toEqual(0);
    expect(subfile.y).toEqual(0);
    expect(subfile.z).toEqual(0);
    expect(subfile.a).toEqual(0);
    expect(subfile.b).toEqual(0);
    expect(subfile.c).toEqual(0);
    expect(subfile.d).toEqual(0);
    expect(subfile.e).toEqual(0);
    expect(subfile.f).toEqual(0);
    expect(subfile.g).toEqual(0);
    expect(subfile.h).toEqual(0);
    expect(subfile.i).toEqual(0);
    expect(subfile.file).toBeFalsy();
    expect(subfile.inverted).toBeUndefined();
    //expect(subfile.animated).toBeUndefined();
  });

  it('should have a constructor with partial props.', () => {
    const subfile = new SubFile({ file: 'a.dat' });
    expect(subfile.file).toEqual('a.dat');
  });

  it('should have a constructor with props', () => {
    const subfile = new SubFile({
      colour: 1,
      x: 2,
      y: 3,
      z: 4,
      a: 5,
      b: 6,
      c: 7,
      d: 8,
      e: 9,
      f: 10,
      g: 11,
      h: 12,
      i: 13,
      file: 'a.dat',
      inverted: true,
      //animated: true,
    });
    expect(subfile.colour).toEqual(1);
    expect(subfile.x).toEqual(2);
    expect(subfile.y).toEqual(3);
    expect(subfile.z).toEqual(4);
    expect(subfile.a).toEqual(5);
    expect(subfile.b).toEqual(6);
    expect(subfile.c).toEqual(7);
    expect(subfile.d).toEqual(8);
    expect(subfile.e).toEqual(9);
    expect(subfile.f).toEqual(10);
    expect(subfile.g).toEqual(11);
    expect(subfile.h).toEqual(12);
    expect(subfile.i).toEqual(13);
    expect(subfile.file).toEqual('a.dat');
    expect(subfile.inverted).toBeTruthy();
    //expect(subfile.animated).toBeTruthy();
  });

  it('should have valid toMatrix4', () => {
    const subfile = new SubFile({
      colour: 1,
      x: 2,
      y: 3,
      z: 4,
      a: 5,
      b: 6,
      c: 7,
      d: 8,
      e: 9,
      f: 10,
      g: 11,
      h: 12,
      i: 13,
      file: 'a.dat',
      inverted: true,
      //animated: true,
    });

    expect(subfile.toMatrix4()).toEqual([
      5,
      6,
      7,
      2,
      8,
      9,
      10,
      3,
      11,
      12,
      13,
      4,
      0,
      0,
      0,
      1,
    ]);
  });
});
