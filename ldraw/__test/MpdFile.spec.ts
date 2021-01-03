import { MpdFile } from '../src/MpdFile';
import { SingleFile } from '../src/SingleFile';
import { SubFile } from '../src/SubFile';

describe('MpdFile', () => {
  it('should assign properties in constructor', () => {
    const file1 = new SingleFile({
      commands: [
        ({ type: 'SUBFILE', file: '2.dat' } as unknown) as SubFile,
        ({ type: 'SUBFILE', file: '1.dat' } as unknown) as SubFile,
      ],
    });
    const file2 = new SingleFile({
      commands: [
        ({ type: 'SUBFILE', file: '1.dat' } as unknown) as SubFile,
        ({ type: 'SUBFILE', file: '3.dat' } as unknown) as SubFile,
      ],
    });

    const file = new MpdFile({ files: [file1, file2] });
    expect(file.filenames).toEqual(['1.dat', '2.dat', '3.dat']);
  });
});
