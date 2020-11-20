import { LDrawFileType } from '../LDrawFile';
import { SingleFile } from '../SingleFile';

//------------------------------------------------------------------------------
// Parse Syntax 1
//------------------------------------------------------------------------------
function fixed<T>(fn: (obj: T, tokens: string[]) => void) {}
function option<T>(match: string, fn: (obj: T, tokens: string[]) => void) {}

const header = [
  fixed<SingleFile>((file: SingleFile, tokens: string[]) => {
    file.meta.description = tokens.slice(1).join(' ');
  }),
  fixed<SingleFile>((file: SingleFile, tokens: string[]) => {
    file.name = tokens.slice(2).join(' ').replaceAll('\\', '/').toLowerCase();
  }),
  fixed<SingleFile>((file: SingleFile, tokens: string[]) => {
    file.meta.author = tokens.slice(2).join(' ');
  }),
  fixed<SingleFile>((file: SingleFile, tokens: string[]) => {
    file.type = tokens[2] as LDrawFileType;
    file.meta.update = tokens.slice(3).join(' ');
  }),
  fixed<SingleFile>((file: SingleFile, tokens: string[]) => {
    file.meta.license = tokens.slice(2).join(' ');
  }),
];
const body = [
  option<SingleFile>('0', (file: SingleFile, tokens: string[]) => {}),
  option<SingleFile>('1', (file: SingleFile, tokens: string[]) => {}),
  option<SingleFile>('2', (file: SingleFile, tokens: string[]) => {}),
  option<SingleFile>('3', (file: SingleFile, tokens: string[]) => {}),
  option<SingleFile>('4', (file: SingleFile, tokens: string[]) => {}),
  option<SingleFile>('5', (file: SingleFile, tokens: string[]) => {}),
];
const single = [header];
