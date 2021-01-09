export const cleanFilename = (filename: string): string =>
  filename
    .trim()

    // Why do people use capitals!!!
    // Look at 47905.dat
    // Some files ARE capital...  "models/10270 - Bookshop.mpd"

    //.toLowerCase()

    // Get rid of backspaces in the name
    .replaceAll('\\', '/')

    // LDraw is a bit too liberal with accepting whitespace in a filename
    // "models/10270 - Bookshop.mpd" has whitespace problems...
    .replaceAll(/\s/g, ' ');
