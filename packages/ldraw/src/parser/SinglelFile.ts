import { LDrawFile, LDrawFileType, FileLine } from '../types';
import { Comment } from './Comment';
import { SubFile } from './SubFile';
import { Line } from './Line';
import { Triangle } from './Triangle';
import { Quadrilateral } from './Quadrilateral';
import { OptionalLine } from './OptionalLine';
import { LDrawParser } from './LDrawParser';
import distinct from '../utils/distinct';

const parseHeaders = (info: LDrawParser, doc: SingleFile): void => {
  const { strings } = info;

  while (info.index < strings.length) {
    const tokens = strings[info.index].trim().split(/\s+/);
    if (!['', '0'].includes(tokens[0])) {
      break;
    }

    const comment = Comment.parseTokens(tokens);
    doc.lines.push(comment);

    if (info.index === 0) {
      if (tokens.length == 2) {
        // 0 description
        doc.description = tokens.slice(1).join(' ');
      } else {
        // 0 brick 1 x 1
        doc.category = tokens[1];
        doc.description = tokens.slice(2).join(' ');
      }
    } else {
      switch (tokens[1]) {
        case 'Name:':
          doc.name = tokens.slice(2).join(' ').replace('\\', '/').toLowerCase();
          break;
        case 'Author:':
          doc.author = tokens.slice(2).join(' ').replace('\\', '/').toLowerCase();
          break;
        case '!LDRAW_ORG':
          doc.type = tokens[2] as LDrawFileType;
          doc.update = tokens.slice(3).join(' ');
          break;
        case '!LICENSE':
          doc.license = tokens.slice(2).join(' ');
          break;
        case '!HELP':
          doc.help.push(tokens.slice(2).join(' '));
          break;
        case '!CATEGORY':
          doc.category = tokens.slice(2).join(' ');
          break;
        case '!KEYWORDS':
          doc.keywords = doc.keywords.concat(tokens.slice(2));
          break;
        case '!HISTORY':
          doc.history.push(tokens.slice(2).join(' '));
          break;
      }
    }
    info.index++;
  }
};

// 0 !LDRAW_ORG Part Alias UPDATE 2013-02
// 0 !LDRAW_ORG Part Flexible_Section UPDATE 2018-02
// 0 !LDRAW_ORG Part Physical_Colour UPDATE 2019-02
export class SingleFile implements LDrawFile {
  name = '';
  folder?: string;
  description = '';
  author = '';
  type: LDrawFileType = LDrawFileType.Unknown;
  license = '';
  help: string[] = [];
  keywords: string[] = [];
  category = '';
  history: string[] = [];
  update = '';

  lines: FileLine[] = [];

  toString(): string {
    //  <3001.dat:part>
    return `<${this.name}:${this.type}>`;
  }

  get files(): SingleFile[] {
    return [this];
  }

  get specs(): string[] {
    return this.getSubFilenames();
  }

  getSubFilenames(): string[] {
    return this.lines
      .map((l: FileLine): string => ('file' in l ? l['file'] : ''))
      .filter((l: string) => l) // Remove empty strings
      .filter(distinct);
  }

  static parse(info: LDrawParser): SingleFile {
    let inverted = false; // next should be inverted?
    let animated = false; // next should be animated?
    let animatedName = undefined; //valid only if animated
    let ccw = true; // dealing with ccw or cw ?
    let certified = false; // certified BFC ?

    const doc = new SingleFile();
    parseHeaders(info, doc);
    for (const line of info.strings.slice(info.index)) {
      const tokens = line.trim().split(/\s+/);
      const lineType = tokens[0];

      switch (lineType) {
        case '': // Fallthrough to 0
        case '0':
          const comment: Comment = Comment.parseTokens(tokens);
          doc.lines.push(comment);
          if (comment.isInvertNext()) {
            inverted = true;
          } else if (comment.isCertify()) {
            certified = true;
            ccw = comment.isCertifyCcw();
          } else if (comment.isBfcCcw()) {
            ccw = true;
          } else if (comment.isAnimated()) {
            animated = true;
            animatedName = comment.animatedName();
          } else if (comment.isBfcCw()) {
            ccw = false;
          }
          break;
        case '1':
          doc.lines.push(SubFile.parseTokens(tokens, inverted, animated, animatedName));
          inverted = false;
          animated = false;
          animatedName = undefined;
          break;
        case '2':
          doc.lines.push(Line.parseTokens(tokens));
          break;
        case '3':
          doc.lines.push(Triangle.parseTokens(tokens, ccw, certified));
          break;
        case '4':
          doc.lines.push(Quadrilateral.parseTokens(tokens, ccw, certified));
          break;
        case '5':
          doc.lines.push(OptionalLine.parseTokens(tokens));
          break;
        default:
          doc.lines.push(Comment.parseTokens(tokens));
      }
    }
    return doc;
  }
}
