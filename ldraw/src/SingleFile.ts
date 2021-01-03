import { Colour } from './Colour';
import { Data } from './Data';
import { LDrawFile, LDrawFileType } from './LDrawFile';
import { Line } from './Line';
import { Meta } from './Meta';
import { MetaData } from './MetaData';
import { OptionalLine } from './OptionalLine';
import { Quad } from './Quad';
import { Command, CommandType, COMMANDTYPE_META } from './Command';
import { SubFile } from './SubFile';
import { Triangle } from './Triangle';
import { distinct } from './utils/distinct';

export class SingleFile implements LDrawFile {
  type: LDrawFileType = 'Unknown';
  name = '';
  text = '';
  meta: MetaData = {};
  readonly commands: Command[] = [];

  constructor(props?: Partial<SingleFile>) {
    if (props) {
      Object.assign(this, props);
    }
  }

  get data(): Data[] {
    return [];
  }

  get files(): SingleFile[] {
    return [this];
  }

  get filenames(): string[] {
    return this.subfiles
      .map((s) => s.file)
      .filter(distinct)
      .sort();
  }

  getCommands<T extends Command>(type: CommandType | CommandType[]) {
    const types = Array.isArray(type) ? type : [type];
    const subfiles = this.commands.filter((s) => types.includes(s.type));
    return subfiles as T[];
  }

  get metas(): Meta[] {
    return this.getCommands<Meta>(COMMANDTYPE_META);
  }

  get subfiles(): SubFile[] {
    return this.getCommands<SubFile>('SUBFILE');
  }

  get lines(): Line[] {
    return this.getCommands<Line>('LINE') as Line[];
  }

  get triangles(): Triangle[] {
    return this.getCommands<Triangle>('TRIANGLE');
  }

  get quads(): Quad[] {
    return this.getCommands<Quad>('QUAD');
  }

  get optionalLines(): OptionalLine[] {
    return this.getCommands<OptionalLine>('OPTIONAL_LINE');
  }

  get colours(): Colour[] {
    return this.getCommands<Colour>('COLOUR');
  }
}
