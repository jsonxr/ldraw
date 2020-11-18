import { FileLine } from '../types';

//------------------------------------------------------------------------------
// Line Type 0: Comments
//------------------------------------------------------------------------------

// Line Types: https://www.ldraw.org/article/218.html
export class Comment implements FileLine {
  static lineType = 0;
  readonly lineType: number = 0;
  text: string | null = null;
  tokens: string[];

  constructor(tokens: string[]) {
    this.tokens = tokens;
  }

  static parseTokens(tokens: string[]): Comment {
    if (!['', '0'].includes(tokens[0])) {
      console.log('Error: ', tokens);
      throw new Error('Parsing Error: ');
    }
    return new Comment(tokens);
  }

  isCertify(): boolean {
    return this.tokens.length >= 2 && this.tokens[1] === 'BFC' && this.tokens[2] === 'CERTIFY';
  }
  isCertifyCcw(): boolean {
    if (this.isCertify() && this.tokens.length == 4) {
      return this.tokens[3] === 'CCW';
    }
    return true;
  }
  isAnimated(): boolean {
    return (
      this.tokens.length >= 2 && this.tokens[1] === 'SIMPLEANIM' && this.tokens[2] === 'ANIMATED'
    );
  }
  animatedName(): string {
    return this.tokens[3];
  }
  isInvertNext(): boolean {
    return this.tokens.length >= 2 && this.tokens[1] === 'BFC' && this.tokens[2] === 'INVERTNEXT';
  }
  isBfcCcw(): boolean {
    return this.tokens.length == 3 && this.tokens[1] === 'BFC' && this.tokens[2] === 'CCW';
  }
  isBfcCw(): boolean {
    return this.tokens.length == 3 && this.tokens[1] === 'BFC' && this.tokens[2] === 'CW';
  }
  isStep(): boolean {
    return this.tokens.length == 2 && this.tokens[1] === 'STEP';
  }
}
