import { ParseError } from '../src/parser/ParseError';

describe('ParseError', () => {
  it('should have a default constructor', () => {
    const error = new ParseError();
    expect(error).toEqual(new Error('Invalid LDraw file'));
  });
});
