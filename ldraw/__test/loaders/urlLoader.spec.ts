import fetchMock from 'jest-fetch-mock';
import { urlLoader } from '../../src/shared/urlLoader';

fetchMock.enableMocks();
jest.spyOn(global.console, 'warn');

describe('urlLoader', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return a location based on window', async () => {
    fetchMock.mockResponseOnce('file contents');
    const load = urlLoader();
    const file = await load('myfile.dat');
    expect(file).toBeTruthy();
  });

  it('should throw error if there is an error status code returned', async () => {
    fetchMock.mockResponse('file contents', { status: 400 });
    const load = urlLoader();
    expect.assertions(1);
    try {
      await load('myfile.dat');
    } catch (err) {
      expect(true).toBeTruthy();
    }
  });

  it('should look at the root of the server if an absolute filename', async () => {
    fetchMock.mockResponseOnce('file contents');
    const load = urlLoader('https://www.jasonrowland.com/ldraw/library/');
    await load('/parts/3001.dat');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/parts/3001.dat'
    );
  });

  it('should throw if there is an exception thrown', async () => {
    fetchMock.mockReject(new Error('User Error'));
    const load = urlLoader();
    expect.assertions(1);
    try {
      await load('myfile.dat');
    } catch {
      expect(true).toBeTruthy();
    }
  });

  it('should try folders if not absolute', async () => {
    fetchMock.mockResponse('file contents', { status: 404 });
    const load = urlLoader('https://www.jasonrowland.com/ldraw/library/', [
      'parts',
      'p',
      '/ldraw/library',
    ]);
    await load('3001.dat');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/ldraw/library/parts/3001.dat'
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/ldraw/library/p/3001.dat'
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/ldraw/library/3001.dat'
    );
  });

  it('should accept an absolute URL string for a base', async () => {
    fetchMock.mockResponseOnce('file contents');
    const load = urlLoader('https://www.jasonrowland.com/ldraw/library/');
    await load('parts/3001.dat');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/ldraw/library/parts/3001.dat'
    );
  });

  it('should accept an absolute URL for a base', async () => {
    fetchMock.mockResponseOnce('file contents');
    const load = urlLoader(
      new URL('library/', 'https://www.jasonrowland.com/ldraw/')
    );
    await load('parts/3001.dat');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.jasonrowland.com/ldraw/library/parts/3001.dat'
    );
  });

  it('should warn if the URL does not end with a slash', async () => {
    fetchMock.mockResponseOnce('file contents');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.console = { warn: jest.fn() } as any;
    const loadFile = urlLoader('/ldraw');
    await loadFile('parts/3001.dat');
    expect(console.warn).toHaveBeenCalled();
  });
});
