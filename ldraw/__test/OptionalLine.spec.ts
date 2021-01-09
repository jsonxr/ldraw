import { OptionalLine } from '../src/shared/OptionalLine';

describe('OptionalLine', () => {
  it('should have a default constructor', () => {
    const optionalLine = new OptionalLine();
    expect(optionalLine.colour).toEqual(0);
    expect(optionalLine.x1).toEqual(0);
    expect(optionalLine.y1).toEqual(0);
    expect(optionalLine.z1).toEqual(0);
    expect(optionalLine.x2).toEqual(0);
    expect(optionalLine.y2).toEqual(0);
    expect(optionalLine.z2).toEqual(0);
  });

  it('should have a constructor with partial props.', () => {
    const optionalLine = new OptionalLine({ colour: 1 });
    expect(optionalLine.colour).toEqual(1);
  });

  it('should have a constructor with props', () => {
    const optionalLine = new OptionalLine({
      colour: 1,
      x1: 2,
      y1: 3,
      z1: 4,
      x2: 5,
      y2: 6,
      z2: 7,
      x3: 8,
      y3: 9,
      z3: 10,
      x4: 11,
      y4: 12,
      z4: 13,
    });
    expect(optionalLine.colour).toEqual(1);
    expect(optionalLine.x1).toEqual(2);
    expect(optionalLine.y1).toEqual(3);
    expect(optionalLine.z1).toEqual(4);
    expect(optionalLine.x2).toEqual(5);
    expect(optionalLine.y2).toEqual(6);
    expect(optionalLine.z2).toEqual(7);
  });
});
