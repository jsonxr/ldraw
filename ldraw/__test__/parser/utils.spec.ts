import {
  CommandParser,
  getInitialState,
  parseCommand,
  parseStrings,
} from '../../src/parser/utils';
import { ParseError } from '../../src/parser/ParseError';

describe('parser/utils', () => {
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
});
