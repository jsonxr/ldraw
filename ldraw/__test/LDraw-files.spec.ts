require('isomorphic-fetch');

import { LDraw } from '../src/shared/LDraw';

// this is a LONG test since we are fetching from the interwebs
jest.setTimeout(60000);

describe.skip('LDraw-files', () => {
  let ldraw: LDraw;
  beforeEach(() => {
    ldraw = new LDraw();
  });

  it('should parse bookshop.mpd', async () => {
    const model = await ldraw.load('models/10270 - Bookshop.mpd');
    console.log(model);
  });
});
