import { LDrawFile, LDrawFileType } from './LDrawFile';
import { SingleFile } from './SingleFile';
import { Data } from './Data';
import { distinct } from './utils/distinct';

export class MpdFile implements LDrawFile {
  type: LDrawFileType = 'Mpd';
  name = '';
  text = '';
  files: SingleFile[] = [];
  data: Data[] = [];
  constructor(props?: Partial<Omit<MpdFile, 'type'>>) {
    Object.assign(this, props);
  }

  get filenames(): string[] {
    let filenames: string[] = [];
    for (const doc of this.files) {
      filenames = filenames.concat(doc.filenames);
    }
    return filenames.filter(distinct).sort();
  }
}
