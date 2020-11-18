export enum LDrawFileType {
  Unknown = '',
  Set = 'Set',
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
  type: LDrawFileType;
  readonly files: LDrawFile[];
  getSubFilenames(): string[];
}

//------------------------------------------------------------------------------
// Sets and Models
//------------------------------------------------------------------------------
//
//    Set
//      - models
//      - partDefs

export interface Model {
  name: string; // Name of the ModelFile to use
  transform: number[];
  step: number;
}

export interface Part {
  name: string;
  transform: number[];
  step: number;
}

//------------------------------------------------------------------------------
// Part Definitions
//------------------------------------------------------------------------------

export interface MetaData {
  name: string;
  file: string;
  description: string;
  author: string;
  type: string;
  license: string;
  help: string[];
  keywords: string[];
  category: string;
  history: string[];
  update: string;
}

export interface MpdFile {
  name: string;
  modelFiles: ModelFile2[];
  partFiles: PartFile[];
}

export interface ModelFile2 extends MetaData {
  theme?: string;
  models: Model[];
  parts: Part[];
}

export interface PartFile extends MetaData {
  geometry: Float32Array;
}

export interface SubpartFile extends MetaData {
  primitives: PrimitiveFile[];
  geometry: number[];
}

export interface PrimitiveFile extends MetaData {
  geometry: number[];
}

export interface SetFile {
  name?: string;
  setNumber?: string;
  subModelName?: string;
  year?: string;

  models: ModelFile2[];
  parts: PartFile[]; // Custom parts that are defined in the set only
}

export interface FileLine {
  readonly lineType: number;
}
