import { ParseError } from '../../src/parser/ParseError';

describe('parser/ParseError', () => {
  describe('new ParseError', () => {
    it('should instantiate with simple message', () => {
      const error = new ParseError('Message');
      expect(error.message).toEqual('Message');
    });
    it('should instantiate with { lineNo, lines }', () => {
      const error = new ParseError('Message', { lineNo: 1, lines: ['a b c'] });
      expect(error.message.trim()).toEqual('Message - line 1:\n\n1: a b c');
      expect(error.lineNo).toEqual(1);
      expect(error.lines).toEqual(['a b c']);
    });
    it('should ignore lineNo if we do not pass in lines', () => {
      const error = new ParseError('Message', { lineNo: 1 });
      expect(error.message.trim()).toEqual('Message');
    });
    it('should ignore lines if we do not pass in lineNo', () => {
      const error = new ParseError('Message', { lines: ['a b c'] });
      expect(error.message.trim()).toEqual('Message');
    });
  });

  describe('static InvalidLDrawFile', () => {
    it('should instantiate with { index, strings }', () => {
      const error = ParseError.InvalidLDrawFile({
        index: 0,
        strings: ['a b c'],
      });
      expect(error.message.trim()).toEqual(
        'Invalid LDraw file - line 1:\n\n1: a b c'
      );
      expect(error.lineNo).toEqual(1);
      expect(error.lines).toEqual(['a b c']);
    });
  });
});
