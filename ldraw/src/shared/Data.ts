export class Data {
  name = '';
  strings: string[] = [];

  constructor(props?: Partial<Data>) {
    Object.assign(this, props);
  }

  push(s: string): void {
    this.strings.push(s);
  }
}
