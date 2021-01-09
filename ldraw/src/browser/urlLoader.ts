import { LoadFile } from '../shared/LoadFile';
import { cleanFilename } from '../shared/utils/clean-filename';

/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */

export const urlLoader = (
  root: URL | string = '',
  folders: string[] = []
): LoadFile => {
  const baseUrl: URL =
    typeof root === 'string'
      ? new URL(root, new URL(window.location.href))
      : root ?? new URL('/ldraw/', new URL(window.location.href));

  // Warn User in case they didn't send in ldraw/
  if (baseUrl.pathname && !baseUrl.pathname.endsWith('/')) {
    console.warn(
      `URL.pathname: "${baseUrl.pathname}" does not end with a slash and may not function as expected`
    );
  }

  folders = folders
    .map((f: string) => cleanFilename(f)) // We work in forward slash only
    .map((f: string) => (f.endsWith('/') ? f : `${f}/`));
  if (!folders.length) {
    folders = [''];
  }

  /**
   * Load file via fetch to same server in /ldraw folder
   * @param filename
   */
  const Loader = async (filename: string): Promise<string | null> => {
    const subfolders = filename.startsWith('/') ? [''] : folders;
    for (const folder of subfolders) {
      const url = new URL(folder + filename, baseUrl);
      const response = await fetch(`${url.href}`);
      if (response.ok) {
        return await response.text();
      } else if (![404].includes(response.status)) {
        const error = await response.text();
        throw new Error(error);
      }
    }

    return null;
  };

  return Loader;
};
