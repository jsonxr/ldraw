import { Data } from './Data';
import { LDrawFile, LDrawFileType } from './LDrawFile';
import { Line } from './Line';
import { MetaData } from './MetaData';
import { OptionalLine } from './OptionalLine';
import { Quad } from './Quad';
import { Spec, SpecType } from './Spec';
import { SubFile } from './SubFile';
import { Triangle } from './Triangle';
import { distinct } from './utils/distinct';

function getFilteredList<T extends Spec>(specs: Spec[], specType: SpecType) {
  const subfiles = specs.filter((s) => s.type === specType);
  return subfiles as T[];
}

export class SingleFile implements LDrawFile {
  type: LDrawFileType = LDrawFileType.Unknown;
  name = '';
  text = '';
  meta: MetaData = {};
  readonly specs: Spec[] = [];

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

  get subfiles(): SubFile[] {
    return getFilteredList<SubFile>(this.specs, SpecType.SUBFILE);
  }

  get filenames(): string[] {
    return this.subfiles
      .map((s) => s.file)
      .filter(distinct)
      .sort();
  }

  get lines(): Line[] {
    return getFilteredList<Line>(this.specs, SpecType.LINE) as Line[];
  }

  get triangles(): Triangle[] {
    return getFilteredList<Triangle>(this.specs, SpecType.TRIANGLE);
  }

  get quads(): Quad[] {
    return getFilteredList<Quad>(this.specs, SpecType.QUAD);
  }

  get optionalLines(): OptionalLine[] {
    return getFilteredList<OptionalLine>(this.specs, SpecType.OPTIONAL_LINE);
  }
}
