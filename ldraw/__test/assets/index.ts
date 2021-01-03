import fs from 'fs';
import path from 'path';

const assets = (filename: string): string =>
  fs.readFileSync(path.join(__dirname, filename), {
    encoding: 'utf8',
  });

export default assets;
