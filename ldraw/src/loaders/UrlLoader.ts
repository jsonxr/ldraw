import { LoadFile } from './LoadFile';
/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */

export const UrlLoader = (base?: URL | string): LoadFile => {
  const baseUrl: URL =
    typeof base === 'string'
      ? new URL(base, new URL(window.location.href))
      : base ?? new URL('/ldraw/', new URL(window.location.href));

  return async (filename: string) => {
    const url = new URL(filename, baseUrl);
    try {
      const response = await fetch(`${url.href}`);
      if (!response.ok) return null;
      return await response.text();
    } catch {} // Ignore any errors
    return null;
  };
};
