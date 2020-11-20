import { LDrawFileType, isMpd, isSingleFile } from '../src/LDrawFile';

describe('LDrawFile', () => {
  const mpdFile = {
    type: LDrawFileType.Mpd,
    name: '',
    text: '',
    files: [],
    data: [],
    filenames: [],
  };
  const singleFile = {
    type: LDrawFileType.Model,
    name: '',
    text: '',
    files: [],
    filenames: [],
  };

  it('should have a type discriminator for Mpd', () => {
    expect(isMpd(mpdFile)).toBeTruthy();
    expect(isMpd(singleFile)).toBeFalsy();
  });

  it('should have a type discriminator for SingleFile', () => {
    expect(isSingleFile(singleFile)).toBeTruthy();
    expect(isSingleFile(mpdFile)).toBeFalsy();
  });
});
