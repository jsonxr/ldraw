import { SingleFile } from './SingleFile';
import { MpdFile } from './MpdFile';
import { Data } from './Data';

export type LDrawFileType =
  | 'Unknown'
  | 'Configuration'
  | 'Mpd'
  | 'Shortcut'
  | 'Subpart'
  | 'Model'
  | 'Part'
  | 'Primitive'
  | '8_Primitive'
  | '48_Primitive'
  | 'Unofficial_Part'
  | 'Unofficial_Subpart'
  | 'Unofficial_Primitive';

export interface LDrawFile {
  name: string;
  text: string;
  type: LDrawFileType;
  files: SingleFile[];
  //data: Data[];
  filenames: string[];
}

export type LDrawFileMpd = {
  type: 'Mpd';
  name: string;
  files: LDrawFilePart | LDrawFileModel;
  filenames: string[];
  data: Data[];
};
export type LDrawFilePart = {
  type: 'Part';
  name: string;
  files: LDrawFilePart | LDrawFileModel;
  filenames: string[];
};
export type LDrawFileModel = {
  type: 'Model';
  name: string;
  files: LDrawFilePart | LDrawFileModel;
  filenames: string[];
};
export type LDrawFileConfiguration = {
  type: 'Configuration';
};
export type LDrawFile2 =
  | LDrawFileMpd
  | LDrawFilePart
  | LDrawFileModel
  | LDrawFileConfiguration;

export const isMpd = (value?: LDrawFile | null): value is MpdFile =>
  value !== null &&
  (value as MpdFile).type === 'Mpd' &&
  (value as MpdFile).data !== undefined;

export const isSingleFile = (value?: LDrawFile | null): value is SingleFile =>
  value !== null &&
  (value as SingleFile).type !== 'Mpd' &&
  (value as SingleFile).files !== undefined &&
  (value as SingleFile).name !== undefined;
