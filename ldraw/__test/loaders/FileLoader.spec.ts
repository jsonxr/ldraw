import { FileLoader } from '../../src/loaders/FileLoader';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('FileLoader', () => {
  it('should load absolute filename', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const loader = FileLoader('/opt/ldraw');
    await loader('/myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/myfile.dat', {
      encoding: 'utf8',
    });
  });

  it('should load relative filename', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const loader = FileLoader('/opt/ldraw');
    await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
  });

  it('should load relative filename from working directory', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const currentPath = path.resolve('./');
    const loader = FileLoader();
    await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith(`${currentPath}/myfile.dat`, {
      encoding: 'utf8',
    });
  });

  it('should return null if file does not exist', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue('oops');
    const loader = FileLoader('/opt/ldraw');
    const result = await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
    expect(result).toBeNull();
  });
});
