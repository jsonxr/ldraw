import { Cache } from './Cache';
import { LDrawFile, LDrawFileType } from './LDrawFile';
import { SingleFile } from './SingleFile';
import { parse } from './parser/parse';

// http://www.ldraw.org/library/official/'

// MPD - Multi-Part Document
// LDR - Lego
// DAT
import { LoadFile } from './loaders/LoadFile';
import { UrlLoader } from './loaders/UrlLoader';

//----------------------------------------------------------------------------
// Manage Download of parts
//----------------------------------------------------------------------------

/**
 * base: URL - This is the location of the ldraw library. This end point must have CORS enabled if it is not hosted on the same server
 */
export class LDraw {
  readonly cache = new Cache<LDrawFile>();
  folders = ['parts', 'p', 'models'];
  loaders: LoadFile[] = [UrlLoader()];
  missing: string[] = [];

  get list(): Record<string, LDrawFile> {
    return this.cache.list;
  }

  get parts(): SingleFile[] {
    const PART_TYPES: LDrawFileType[] = ['Part', 'Unofficial_Part'];
    return (Object.values(this.list).filter(
      (m: LDrawFile) => m && PART_TYPES.includes(m.type)
    ) as unknown) as SingleFile[];
  }

  constructor(props?: Partial<Pick<LDraw, 'folders' | 'loaders'>>) {
    Object.assign(this, props);
  }

  /**
   *
   * @param filename - the absolute path of the model to load.
   */
  async load(filename: string, loader?: LoadFile): Promise<LDrawFile | null> {
    const loaders = loader ? [loader] : this.loaders;
    let data = null;
    for (let i = 0; i < loaders.length; i++) {
      data = await loaders[i](filename);
      if (data !== null) {
        break;
      }
    }

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

        // We want to exhaust all the folders on a loader before trying the next
        for (let i = 0; i < this.loaders.length; i++) {
          for (const folder of folders) {
            const loader = this.loaders[i];
            const model = await this.load(`${folder}/${filename}`, loader);
            if (model) {
              model.name = filename;
              return model;
            }
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
