export const distinct = (
  value: unknown,
  index: number,
  self: Array<unknown>
): boolean => self.indexOf(value) === index;
