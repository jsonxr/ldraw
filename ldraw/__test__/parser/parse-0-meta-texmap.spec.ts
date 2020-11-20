import { parse } from '../../src/parser/parse';

import { Meta } from '../../src/Meta';
import { singleFile } from '../test-utils';
import { SpecType } from '../../src';
describe('0 !TEXMAP', () => {
  it('should ignore !TEXMAP', () => {
    const str = '0 !TEXMAP START';
    const parsed = parse(singleFile(str));
    expect(parsed?.files.length).toEqual(1);
    expect(parsed!.files[0].specs[0]).toEqual(
      new Meta({ type: SpecType.TEXMAP, lineNo: 6, line: '0 !TEXMAP START' })
    );
  });
});
