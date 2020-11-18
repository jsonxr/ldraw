import { LDrawFile, LDrawFileType } from '../types';
import { SingleFile } from './SinglelFile';
import { LDrawParser } from './LDrawParser';
import distinct from '../utils/distinct';

export class MpdFile implements LDrawFile {
  name = '';
  type = LDrawFileType.Set;
  files: SingleFile[] = [];

  getSubFilenames(): string[] {
    return this.files
      .map((d) => d.getSubFilenames())
      .flat()
      .filter(distinct);
  }

  static parse(parser: LDrawParser): MpdFile {
    const { strings } = parser;
    let start = 0;
    let i = start;
    const multipart = new MpdFile();
    while (i < strings.length - 1) {
      if (i > 0 && strings[i].startsWith('0 FILE ')) {
        multipart.files.push(SingleFile.parse(new LDrawParser(strings.slice(start + 1, i))));
        start = i;
      }
      i++;
    }
    multipart.files.push(SingleFile.parse(new LDrawParser(strings.slice(start + 1, i))));
    return multipart;
  }
}
