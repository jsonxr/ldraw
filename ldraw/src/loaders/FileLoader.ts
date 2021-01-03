import fs from 'fs/promises';
import path from 'path';

/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */
export const FileLoader = (dir?: string) => {
  const root = dir ?? path.resolve('./');

  const Loader = async (filename: string) => {
    const filePath = path.isAbsolute(filename)
      ? filename
      : path.resolve(path.join(root, filename));
    try {
      return await fs.readFile(filePath, { encoding: 'utf8' });
    } catch {} // Ignore any errors
    return null;
  };

  return Loader;
};
