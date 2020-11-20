import { LoadFile } from '../LoadFile';
/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */

export const UrlLoader = (base?: URL): LoadFile => async (filename: string) => {
  const baseUrl: URL = base ?? new URL('/ldraw', new URL(window.location.href));
  const url = new URL(filename, baseUrl);
  try {
    const response = await fetch(`${url.href}`);
    if (!response.ok) return null;
    return await response.text();
  } catch (err) {} // Ignore any errors
  return null;
};
