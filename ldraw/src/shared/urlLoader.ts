import { LoadFile } from './LoadFile';
import { cleanFilename } from './utils/clean-filename';

//https://www.ldraw.org/library/official/<filepath>

const defaultHref: string =
  // window
  (typeof self === 'object' && self.self === self && self?.location.href) ||
  // node
  (typeof global === 'object' &&
    global.global === global &&
    global?.location?.href) ||
  // default
  'https://www.ldraw.org/library/official/';

/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */
export const urlLoader = (
  root: URL | string = '',
  folders: string[] = []
): LoadFile => {
  console.log('root: ', root);
  // Figure out the root url

  const baseUrl: URL =
    typeof root === 'string'
      ? root
        ? new URL(root)
        : new URL(defaultHref)
      : root instanceof URL
      ? root
      : new URL('/ldraw/', new URL(defaultHref));
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
