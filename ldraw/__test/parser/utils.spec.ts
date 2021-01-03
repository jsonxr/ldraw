import {
  chompCommands,
  CommandParser,
  getInitialState,
  parseCommand,
  parseNextLine,
  parseStrings,
} from '../../src/parser/utils';
import { ParseError } from '../../src/parser/ParseError';

describe('parser/utils', () => {
  describe('chompCommand', () => {
    it('should take off a known command', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^1\s+(\S+)/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const next = chompCommands(state, '1 hi 2 hello', [one]);
      expect(next).toEqual('2 hello');
    });
    it('should return string if no matches', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^NOMATCH/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const next = chompCommands(state, '1 hi 2 hello', [one]);
      expect(next).toEqual('1 hi 2 hello');
    });
    it('should throw error if it matches without any characters', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      expect(() => {
        chompCommands(state, '1 hi 2 hello', [one]);
      }).toThrowError(
        'Match MUST match at least some characters: match=undefined last="1 hi 2 hello" nextline="1 hi 2 hello"'
      );
    });
    it('should return string if match in the middle', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /2 hello/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const next = chompCommands(state, '1 hi 2 hello 3 howareya', [one]);
      expect(next).toEqual('1 hi  3 howareya');
    });
  });

  describe('parseCommand', () => {
    it('should match the token to a command', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^1\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const result = parseCommand(state, '1 2 3', [one]);
      expect(result).toBeTruthy();
      expect(one.parseLine).toHaveBeenCalled();
    });

    it('should call command with original line and args from capture group', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^1\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const result = parseCommand(state, '1 2 3', [one]);
      expect(result).toBeTruthy();
      expect(one.parseLine).toHaveBeenCalledWith(state, {
        line: '1 2 3',
        args: ['2 3'],
      });
    });

    it('should call command with original line and args from multiple capture groups', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^1\s+(\S*)\s+(\S*)\s+(\S*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const result = parseCommand(state, '1 a b c', [one]);
      expect(result).toBeTruthy();
      expect(one.parseLine).toHaveBeenCalledWith(state, {
        line: '1 a b c',
        args: ['a', 'b', 'c'],
      });
    });

    it('should return false if the first token does not match a command', () => {
      const state = getInitialState();
      const one: CommandParser = {
        match: /^x/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const result = parseCommand(state, '1 2 3', [one]);
      expect(result).toBeFalsy();
      expect(one.parseLine).not.toHaveBeenCalled();
    });
  });

  describe('parseStrings', () => {
    it('should parse all strings possible', () => {
      const state = getInitialState(['1 a b c', '2 x y z', '3 a b c']);
      const one: CommandParser = {
        match: /^1\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const two: CommandParser = {
        match: /^2\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      parseStrings(state, [one, two]);
      expect(one.parseLine).toHaveBeenCalledWith(state, {
        line: '1 a b c',
        args: ['a b c'],
      });
      expect(two.parseLine).toHaveBeenCalledWith(state, {
        line: '2 x y z',
        args: ['x y z'],
      });
      expect(state.index).toEqual(2);
    });

    it('should call parseLine on matching commands with an array of matches', () => {
      const state = getInitialState(['1 a b c', '2 x y z']);
      const one: CommandParser = {
        match: /^1\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const two: CommandParser = {
        match: /^2\s+(.*)$/,
        parseLine: jest.fn().mockReturnValue(true),
      };
      const result = parseStrings(state, [one, two]);
      expect(result).toBeTruthy();
      expect(one.parseLine).toHaveBeenCalledWith(state, {
        line: '1 a b c',
        args: ['a b c'],
      });
      expect(two.parseLine).toHaveBeenCalledWith(state, {
        line: '2 x y z',
        args: ['x y z'],
      });
      expect(state.index).toEqual(2);
    });
  });

  describe('parseNextLine', () => {
    it('should parse the next line and advance the state.index if successful', () => {
      const parseFn = jest.fn();
      const state = getInitialState(['1 a b c', '2 x y z']);
      parseNextLine(state, /^1/, parseFn);
      expect(parseFn).toBeCalled();
      expect(state.index).toEqual(1);
    });

    it("should throw error if nextLine doesn't match regex", () => {
      const parseFn = jest.fn();
      const state = getInitialState(['1 a b c', '2 x y z']);
      expect(() => {
        parseNextLine(state, /^2/, parseFn);
      }).toThrowError(ParseError.InvalidLDrawFile(state));
    });
  });
});
