import { LDrawFile, LDrawFileType } from './LDrawFile';
import { SingleFile } from './SingleFile';
import { parse } from './parser/parse';
import { cleanFilename } from './utils/clean-filename';

// http://www.ldraw.org/library/official/'

// MPD - Multi-Part Document
// LDR - Lego
// DAT
import { LoadFile } from './loaders/LoadFile';
import { urlLoader } from './loaders/urlLoader';
import { observable } from './utils/observable';
import { promiseCache } from './utils/promiseCache';

//----------------------------------------------------------------------------
// Manage Download of parts
//----------------------------------------------------------------------------

/**
 * base: URL - This is the location of the ldraw library. This end point must have CORS enabled if it is not hosted on the same server
 */
export class LDraw {
  // Defaults for the LDraw object when instantiated
  static defaultUrl = 'https://www.jasonrowland.com/ldraw/library/';

  readonly missing: string[] = [];

  //private readonly _cache = new Cache<LDrawFile>();
  // private readonly _fileCache = promiseCache<LDrawFile | null>({
  //   name: '_fileCache',
  //   limit: Number.MAX_SAFE_INTEGER,
  // });
  private readonly _filepromises: Record<
    string,
    Promise<LDrawFile | null>
  > = {};
  private readonly _files: Record<string, LDrawFile | null> = {};
  private readonly _downloads = promiseCache<string | null>({
    name: '_downloads',
    throttle: 20,
  });

  private _loaders: LoadFile[] = [urlLoader(LDraw.defaultUrl)];
  private _loading = false;

  // Implement the observable to monitor filename changes
  private _observable = observable<string>();
  subscribe = this._observable.subscribe.bind(this._observable);
  unsubscribe = this._observable.unsubscribe.bind(this._observable);

  constructor({
    loaders,
  }: {
    loaders?: LoadFile[];
  } = {}) {
    if (loaders) {
      this._loaders = loaders;
    }
  }

  get loading(): boolean {
    return this._loading;
  }

  set(key: string, value: LDrawFile): void {
    this._files[key] = value;
  }

  get loaders(): LoadFile[] {
    return this._loaders;
  }
  set loaders(values: LoadFile[]) {
    this._loaders = values;
  }

  get files(): Record<string, LDrawFile | null> {
    return this._files;
  }

  get parts(): SingleFile[] {
    const PART_TYPES: LDrawFileType[] = ['Part', 'Unofficial_Part'];
    return (Object.values(this.files).filter(
      (m: LDrawFile | null) => m && PART_TYPES.includes(m.type)
    ) as unknown) as SingleFile[];
  }

  /**
   *
   * @param filename - the absolute path of the model to load.
   */
  async load(filename: string, cache = false): Promise<LDrawFile | null> {
    this._loading = true;
    let file = null;
    try {
      file = await this._load(filename, cache);
    } finally {
      this._loading = false;
      this._observable.notify('');
    }
    return file;
  }

  /**
   * Download and cache the promise for the file
   * @param filename
   */
  async download(filename: string): Promise<string | null> {
    const promise = this._downloads(
      filename,
      async (): Promise<string | null> => {
        let result = null;
        this._observable.notify(filename);
        for (let i = 0; i < this._loaders.length; i++) {
          const loader = this._loaders[i];
          result = await loader(filename);
          if (result) {
            break;
          }
        }
        return result;
      }
    );
    return promise;
  }

  /**
   *
   * @param filename - the absolute path of the model to load.
   */
  async _load(filename: string, cache: boolean): Promise<LDrawFile | null> {
    // 1) Do we already have this file?
    if (this._files[filename]) {
      return this._files[filename];
    }

    // 2) Do we already have an in-progress promise?
    let promise = this._filepromises[filename];
    if (promise) {
      return promise;
    }

    // 3) Create a promise to Download and Parse the LDraw file
    promise = new Promise<LDrawFile | null>(async (resolve, reject) => {
      try {
        // 4) Download the file
        const data = await this.download(filename);
        if (!data) {
          this.missing.push(filename);
          resolve(null);
          delete this._filepromises[filename];
          return;
        }

        // 5) Parse the file
        let file: LDrawFile | null = null;
        file = parse(data);
        if (cache && file) {
          this.set(filename, file);
        }

        // 6) Cache the embedded files if this is an MPd
        if (cache) {
          file?.files
            .filter((f) => f.name !== filename)
            .forEach((f: SingleFile) => {
              this.set(f.name, f);
            });
        }

        // 7) Download any subfiles
        if (file) {
          const promises: Promise<LDrawFile | null>[] = [];
          const embedded = file.files.map((f) => f.name);
          for (const f of file.filenames) {
            if (!embedded.includes(f)) {
              // First, check the mpd for this file, it might be in the file
              promises.push(this._load(cleanFilename(f).toLowerCase(), true));
            }
          }
          await Promise.allSettled(promises);
        }

        resolve(file);
        delete this._filepromises[filename];
      } catch (err) {
        reject(err);
      }
    });

    // Cache this promise if requested
    if (cache) {
      this._filepromises[filename] = promise;
    }

    return promise;
  }
}
