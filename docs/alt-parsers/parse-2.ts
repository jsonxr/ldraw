import { LDrawFileType } from '../LDrawFile';
import { SingleFile } from '../SingleFile';

//------------------------------------------------------------------------------
// Parse Syntax 2
//------------------------------------------------------------------------------

const parseDescription = (file: SingleFile, tokens: string[]) => {
  file.meta.description = tokens.slice(1).join(' ');
};
const parseName = (file: SingleFile, tokens: string[]) => {
  file.name = tokens.slice(2).join(' ').replaceAll('\\', '/').toLowerCase();
};
const parseAuthor = (file: SingleFile, tokens: string[]) => {
  file.meta.author = tokens.slice(2).join(' ');
};
const parseType = (file: SingleFile, tokens: string[]) => {
  file.type = tokens[2] as LDrawFileType;
  file.meta.update = tokens.slice(3).join(' ');
};
const parseLicense = (file: SingleFile, tokens: string[]) => {
  file.meta.license = tokens.slice(2).join(' ');
};

const parseHeader = [
  parseDescription,
  parseName,
  parseAuthor,
  parseType,
  parseLicense,
];

const parseComment = () => {};
const parseSubfile = () => {};
const parseLine = () => {};
const parseTriangle = () => {};
const parseQuad = () => {};
const parseOptionalLine = () => {};

const parseBody = {
  '0': parseComment,
  '1': parseSubfile,
  '2': parseLine,
  '3': parseTriangle,
  '4': parseQuad,
  '5': parseOptionalLine,
};

const parseSingle = [parseHeader, parseBody];
