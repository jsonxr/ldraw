export interface HeaderProps {
  name?: string;
  type?: string;
}

/**
 * Returns a valid LDraw header
 */
export const header = ({
  name = 'single.dat',
  type = 'Model',
}: HeaderProps = {}) =>
  `
0 ${name}
0 Name: ${name}
0 Author: Jason Rowland [jason]
0 !LDRAW_ORG ${type}
0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt
`.trim();

/**
 * returns a valid LDraw file with given content
 * @param content
 * @param options
 */
export const singleFile = (content: string, options?: HeaderProps) =>
  `${header(options)}\n${content.trim()}`;

export const triangle = () => `3 16 1 2 3 4 5 6 7 8 9`;

/**
 * Returns a valid mpd file entry given content
 * @param content
 * @param options
 */
export const mpdFile = (
  content: string,
  { name }: HeaderProps = { name: 'single.dat' }
) => {
  const fileEntry = `
0 FILE ${name}
${header({ name, type: 'Model' })}

${content}
`;
  return fileEntry.trim();
};

// export const getState = (txt: string) =>
//   getInitialState(singleFile(txt).split('\n'));
