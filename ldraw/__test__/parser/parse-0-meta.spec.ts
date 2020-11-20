import { parse } from '../../src/parser/parse';
import { Meta } from '../../src/Meta';
import { singleFile, triangle } from '../test-utils';
describe('0 !', () => {
  it('should ignore !CMDLINE metas', () => {
    const str = '0 !CMDLINE x';
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].specs[0]).toEqual(
      new Meta({ lineNo: 6, line: str })
    );
  });

  it('should ignore !LDCAD metas', () => {
    const parsed = parse(singleFile('0 !LDCAD x'));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].specs.length).toEqual(1);
    expect(parsed!.files[0].specs[0]).toEqual(
      new Meta({ lineNo: 6, line: '0 !LDCAD x' })
    );
  });

  it('should set a !THEME', () => {
    const str = singleFile('0 !THEME xyz 123');
    const parsed = parse(str);
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.theme).toEqual('xyz 123');
  });

  it('should add !HISTORY entries', () => {
    const str = `
      0 !HISTORY xyz 123
      0 !HISTORY abc
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.history?.length).toEqual(2);
    expect(parsed!.files[0].meta.history![0]).toEqual('xyz 123');
    expect(parsed!.files[0].meta.history![1]).toEqual('abc');
  });

  it('should add !HELP entries', () => {
    const str = `
      0 !HELP xyz 123
      0 !HELP abc
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.help?.length).toEqual(2);
    expect(parsed!.files[0].meta.help![0]).toEqual('xyz 123');
    expect(parsed!.files[0].meta.help![1]).toEqual('abc');
  });

  it('should add !CATEGORY', () => {
    const str = `
      0 !CATEGORY Minifig Accessories
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.category).toEqual('Minifig Accessories');
  });

  it('should ignore a further !CATEGORY', () => {
    const str = `
      0 !CATEGORY Minifig Accessories
      0 !CATEGORY Invalid Entry
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.category).toEqual('Minifig Accessories');
  });

  it('should add !KEYWORDS entries', () => {
    const str = `
      0 !KEYWORDS X Y Z,A, B, C,
      0 !KEYWORDS abc
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].meta.keywords?.length).toEqual(5);
  });

  it('should add a Meta for an unknown command', () => {
    const str = `
      0 !UNKNOWN x y z
    `;
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].specs.length).toEqual(1);
    expect(parsed!.files[0].specs[0]).toEqual(
      new Meta({ lineNo: 6, line: '0 !UNKNOWN x y z' })
    );
  });
});
