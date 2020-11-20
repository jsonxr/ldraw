import { UrlLoader } from '../../src/loaders/UrlLoader';
import assets from '../assets';
const header = assets('header.dat');

describe('UrlLoader', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return a location based on window', async () => {
    fetchMock.mockResponseOnce(header);
    const loader = UrlLoader();
    const file = await loader('myfile.dat');
    expect(file).toBeTruthy();
  });
  it('should return null if there is an error status code returned', async () => {
    fetchMock.mockResponseOnce('User Error', { status: 400 });
    const loader = UrlLoader();
    const file = await loader('myfile.dat');
    expect(file).toBeNull();
  });
  it('should return null if there is an exception thrown', async () => {
    fetchMock.mockReject(new Error('User Error'));
    const loader = UrlLoader();
    const file = await loader('myfile.dat');
    expect(file).toBeNull();
  });
});
