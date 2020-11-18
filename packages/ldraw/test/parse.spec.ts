import { LDrawParser } from '../src/parser/LDrawParser';
import fs from 'fs/promises';
import path from 'path';

describe('parse.ts', () => {
  it('should parse a multipart doc correctly', async () => {
    const data = await fs.readFile(path.join(__dirname, './assets/bookshop.mpd'), {
      encoding: 'utf8',
    });
    const file = LDrawParser.parse(data);
    expect(file).toBeTruthy();
  });
});
