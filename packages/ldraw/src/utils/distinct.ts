export default (value: unknown, index: number, self: Array<unknown>): boolean =>
  self.indexOf(value) === index;
