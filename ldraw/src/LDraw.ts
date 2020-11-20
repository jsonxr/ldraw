import { Cache } from './Cache';
import { LDrawFile, LDrawFileType } from './LDrawFile';
import { SingleFile } from './SingleFile';
import { parse } from './parser/parse';

// http://www.ldraw.org/library/official/'

// MPD - Multi-Part Document
// LDR - Lego
// DAT
import { LoadFile } from './LoadFile';
import { UrlLoader } from './loaders/UrlLoader';

//----------------------------------------------------------------------------
// Manage Download of parts
//----------------------------------------------------------------------------

/**
 * base: URL - This is the location of the ldraw library. This end point must have CORS enabled if it is not hosted on the same server
 */
export class LDraw {
  cache = new Cache<LDrawFile>();
  folders = ['/parts', '/p', '/models'];
  loadFile: LoadFile = UrlLoader(new URL('http://localhost:8080'));
  missing: string[] = [];

  get list(): Record<string, LDrawFile> {
    return this.cache.list;
  }

  get parts(): SingleFile[] {
    const PART_TYPES = [LDrawFileType.Part, LDrawFileType.Unofficial_Part];
    return (Object.values(this.list).filter(
      (m: LDrawFile) => m && PART_TYPES.includes(m.type)
    ) as unknown) as SingleFile[];
  }

  constructor(props?: Partial<LDraw>) {
    Object.assign(this, props);
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

    const file = parse(data);
    // MpdFile has embedded files
    if (file) {
      file.files.forEach((f: SingleFile) => this.cache.set(f.name, f));

      // Download all files not in cache one at at time
      for (const doc of file.files) {
        const filenames = doc.filenames;
        for (const f of filenames) {
          if (!this.cache.has(f)) {
            await this.find(f);
          }
        }
      }
    }

    return file;
  }

  async find(filename: string): Promise<LDrawFile | null> {
    const file = await this.cache.get(
      filename,
      async (): Promise<LDrawFile | null> => {
        // Make sure we don't have a slash on the end of our folder
        const folders = this.folders
          .map((f: string) => f.replaceAll('\\', '/'))
          .map((f: string) =>
            f.endsWith('/') ? f.substr(0, f.length - 1) : f
          );
        for (const folder of folders) {
          const model = await this.load(`${folder}/${filename}`);
          if (model) {
            model.name = filename;
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
