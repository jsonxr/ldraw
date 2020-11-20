import fs from 'fs/promises';
import { LoadFile } from '../LoadFile';
/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */

const FileLoader = (): LoadFile => async (filename: string) => {
  //const absoluteFilename = path.resolve(path.join(dir, filename));
  return await fs.readFile(filename, { encoding: 'utf8' });
};

export default FileLoader;
