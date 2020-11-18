import { LDrawFile } from './types';
import { LDrawParser } from './parser';
import { Cache } from './Cache';

// http://www.ldraw.org/library/official/'

// MPD - Multi-Part Document
// LDR - Lego
// DAT

export type LoadFileFn = (filename: string) => Promise<string | null>;

/**
 * Load file via fetch to same server in /ldraw folder
 * @param filename
 */

export const UrlLoader = (base?: URL): LoadFileFn => async (filename: string) => {
  const baseUrl: URL = base ?? new URL('/ldraw', new URL(window.location.href));
  const url = new URL(filename, baseUrl);
  try {
    const response = await fetch(`${url.href}`);
    if (!response.ok) return null;
    return await response.text();
  } catch (err) {} // Ignore any errors
  return null;
};

// export const FileLoader = (base?: string): LoadFileFn => async (filename: string) => {
//   const dir = path.resolve('./docs/library');
//   const data = await fs.readFile(path.join(dir, filename), { encoding: 'utf-8' });
//   return data;
// };

//----------------------------------------------------------------------------
// Manage Download of parts
//----------------------------------------------------------------------------

export interface LDrawProps {
  folders?: string[];
  missing?: string[];
  loadFile?: LoadFileFn;
  cache?: Cache<LDrawFile>;
}

/**
 * base: URL - This is the location of the ldraw library. This end point must have CORS enabled if it is not hosted on the same server
 */
export class LDraw implements LDrawProps {
  folders = ['/parts', '/p'];
  missing: string[] = [];
  cache = new Cache<LDrawFile>();
  loadFile = UrlLoader(new URL('http://localhost:8080'));

  get list(): Record<string, LDrawFile> {
    return this.cache.list;
  }

  constructor(options?: LDrawProps) {
    Object.assign(this, options);
    // folders MUST end with a "/" to find relative paths inside files
    this.folders = this.folders.map((f) => (f.endsWith('/') ? f : f + '/'));
  }

  assignTo(dest: LDraw): void {
    dest.folders = this.folders;
    dest.missing = this.missing;
    dest.cache = this.cache;
  }

  /**
   *
   * @param filename - the absolute path of the model to load.
   */
  async load(filename: string): Promise<LDrawFile | null> {
    const data = await this.loadFile(filename);
    if (!data) {
      return null;
    }

    const file = LDrawParser.parse(data);
    if (!file) {
      return null;
    }

    // SetFile has embedded files
    for (const doc of file.files) {
      this.cache.set(doc.name, doc);
    }

    // Download all files not in cache one at at time
    for (const doc of file.files) {
      const filenames = doc.getSubFilenames();
      for (const f of filenames) {
        if (!this.cache.has(f)) {
          await this.find(f);
        }
      }
    }

    return file;
  }

  async find(filename: string): Promise<LDrawFile | null> {
    const file = await this.cache.get(
      filename,
      async (): Promise<LDrawFile | null> => {
        for (const folder of this.folders) {
          const model = await this.load(`${folder}${filename}`);
          if (model) {
            return model;
          }
        }
        return null;
      }
    );

    if (!file) {
      this.missing.push(filename);
    }

    return file;
  }
}
