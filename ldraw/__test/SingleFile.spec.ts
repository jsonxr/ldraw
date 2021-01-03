import { SingleFile } from '../src/SingleFile';
import { Line } from '../src/Line';
import { Comment } from '../src/Comment';
import { SubFile } from '../src/SubFile';
import { Triangle } from '../src/Triangle';
import { Quad } from '../src/Quad';
import { OptionalLine } from '../src/OptionalLine';
import { Colour } from 'ldraw/src/Colour';

describe('SingleFile', () => {
  let file: SingleFile;
  beforeEach(() => {
    file = new SingleFile();
    // 0
    file.commands.push(new Comment({ line: 'my comment', lineNo: 1 }));
    // 1
    file.commands.push(new SubFile({ file: 'b.dat' }));
    file.commands.push(new SubFile({ file: 'a.dat' }));
    file.commands.push(new SubFile({ file: 'a.dat' }));
    // 2
    file.commands.push(new Line({ colour: 2 }));
    // 3
    file.commands.push(new Triangle({ colour: 3 }));
    // 4
    file.commands.push(new Quad({ colour: 4 }));
    // 5
    file.commands.push(new OptionalLine({ colour: 5 }));
    // colours
    file.commands.push(new Colour({}));
  });

  it('should assign properties in constructor', () => {
    file = new SingleFile({ name: 'name' });
    expect(file.name).toEqual('name');
  });

  it('should return list of subfiles', () => {
    expect(file.subfiles.length).toEqual(3);
    expect(file.subfiles[0].file).toEqual('b.dat');
    expect(file.subfiles[1].file).toEqual('a.dat');
    expect(file.subfiles[2].file).toEqual('a.dat');
  });

  it('should return unique list of filenames for subfiles', () => {
    expect(file.filenames.length).toEqual(2);
    expect(file.filenames).toEqual(['a.dat', 'b.dat']);
  });

  it('should return list of lines', () => {
    expect(file.lines.length).toEqual(1);
    expect(file.lines[0].type).toEqual('LINE');
    expect(file.lines[0].colour).toEqual(2);
  });

  it('should return list of lines', () => {
    expect(file.triangles.length).toEqual(1);
    expect(file.triangles[0].type).toEqual('TRIANGLE');
    expect(file.triangles[0].colour).toEqual(3);
  });

  it('should return list of quads', () => {
    expect(file.quads.length).toEqual(1);
    expect(file.quads[0].type).toEqual('QUAD');
    expect(file.quads[0].colour).toEqual(4);
  });

  it('should return list of optionalLines', () => {
    expect(file.optionalLines.length).toEqual(1);
    expect(file.optionalLines[0].type).toEqual('OPTIONAL_LINE');
    expect(file.optionalLines[0].colour).toEqual(5);
  });

  it('should return list of colours', () => {
    expect(file.colours.length).toEqual(1);
    expect(file.colours[0].type).toEqual('COLOUR');
  });

  it('should always have an empty data[]', () => {
    expect(file.data.length).toEqual(0);
  });
});
