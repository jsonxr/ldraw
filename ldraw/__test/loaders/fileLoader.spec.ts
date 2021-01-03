import { fileLoader } from '../../src/loaders/fileLoader';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');

describe('fileLoader', () => {
  it('should restrict all access to the root dir', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const loader = fileLoader('/opt/ldraw');
    await loader('../myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
  });

  it('should load absolute filename', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const loader = fileLoader('/opt/ldraw');
    await loader('/myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
  });

  it('should load relative filename', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const loader = fileLoader('/opt/ldraw');
    await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
  });

  it('should load relative filename from working directory', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue('content');
    const currentPath = path.resolve('./');
    const loader = fileLoader();
    await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith(`${currentPath}/myfile.dat`, {
      encoding: 'utf8',
    });
  });

  it('should return null if file does not exist', async () => {
    (fs.readFile as jest.Mock).mockRejectedValue('oops');
    const loader = fileLoader('/opt/ldraw');
    const result = await loader('myfile.dat');
    expect(fs.readFile).toHaveBeenCalledWith('/opt/ldraw/myfile.dat', {
      encoding: 'utf8',
    });
    expect(result).toBeNull();
  });
});
