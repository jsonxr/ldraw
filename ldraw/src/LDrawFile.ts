import { SingleFile } from './SingleFile';
import { MpdFile } from './MpdFile';

export enum LDrawFileType {
  Unknown = '',
  Mpd = 'Mpd',
  Shortcut = 'Shortcut',
  Subpart = 'Subpart',
  Model = 'Model',
  Part = 'Part',
  Primitive = 'Primitive',
  Primitive8 = '8_Primitive',
  Primitive48 = '48_Primitive',
  Unofficial_Part = 'Unofficial_Part',
  Unofficial_Primitive = 'Unofficial_Primitive',
}

export interface LDrawFile {
  name: string;
  text: string;
  type: LDrawFileType;
  files: SingleFile[];
  //data: Data[];
  filenames: string[];
}

export const isMpd = (value: LDrawFile): value is MpdFile =>
  (value as MpdFile).type === LDrawFileType.Mpd &&
  (value as MpdFile).data !== undefined;

export const isSingleFile = (value: LDrawFile): value is SingleFile =>
  (value as SingleFile).type !== LDrawFileType.Mpd &&
  (value as SingleFile).files !== undefined &&
  (value as SingleFile).name !== undefined;
