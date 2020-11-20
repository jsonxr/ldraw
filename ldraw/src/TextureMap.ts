export class TextureMap {
  name = '';
  strings: string[] = [];

  constructor(props?: Partial<TextureMap>) {
    Object.assign(this, props);
  }

  push(s: string): void {
    this.strings.push(s);
  }
}
