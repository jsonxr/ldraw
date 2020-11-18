import { LDrawFile } from '../types';
import { SingleFile } from './SinglelFile';
import { MpdFile } from './MpdFile';

export class LDrawParser {
  index = 0;
  step = 0;
  strings: string[];

  constructor(data: string | string[]) {
    if (typeof data === 'string') {
      this.strings = data.trim().split('\n');
    } else {
      this.strings = data;
    }
    if (this.strings.length === 0) {
      throw new Error('LDrawParser: strings.length === 0');
    }
  }

  parse(): LDrawFile | null {
    if (this.strings[0].startsWith('0 FILE ')) {
      return MpdFile.parse(this);
    }
    return SingleFile.parse(this);
  }

  static parse(data: string | string[]): LDrawFile | null {
    const parser = new LDrawParser(data);
    return parser.parse();
  }
}
