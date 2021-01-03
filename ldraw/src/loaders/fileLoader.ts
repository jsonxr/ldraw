import fs from 'fs/promises';
import path from 'path';
import { LoadFile } from './LoadFile';
import { cleanFilename } from '../utils/clean-filename';

/**
 * Creates a fileLoader to ooad a file from the filesystem
 * @param options -
 * @param options.dir - root of file system...
 * @param options.folders - list of folders to look for file
 */
export const fileLoader = (root = './', folders: string[] = ['']): LoadFile => {
  const dir = path.resolve(root);
  folders = folders
    .map((f: string) => cleanFilename(f)) // We work in forward slash only
    .map((f: string) => (f.endsWith('/') ? f : `${f}/`)); // end with a slash

  /**
   * Load file via fetch to same server in /ldraw folder
   * @param filename
   */
  const Loader = async (filename: string): Promise<string | null> => {
    const subfolders = path.isAbsolute(filename) ? [''] : folders;
    for (const folder of subfolders) {
      const filepath = path.join(dir, path.resolve(folder, filename));
      try {
        return await fs.readFile(filepath, { encoding: 'utf8' });
      } catch {} // Ignore any errors
    }

    return null;
  };

  return Loader;
};
