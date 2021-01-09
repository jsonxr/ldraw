import { Line } from '../src/shared/Line';

describe('Line', () => {
  it('should have a default constructor', () => {
    const line = new Line();
    expect(line.colour).toEqual(0);
    expect(line.x1).toEqual(0);
    expect(line.y1).toEqual(0);
    expect(line.z1).toEqual(0);
    expect(line.x2).toEqual(0);
    expect(line.y2).toEqual(0);
    expect(line.z2).toEqual(0);
  });

  it('should have a constructor with partial props.', () => {
    const line = new Line({ colour: 1 });
    expect(line.colour).toEqual(1);
  });

  it('should have a constructor with props', () => {
    const line = new Line({
      colour: 1,
      x1: 2,
      y1: 3,
      z1: 4,
      x2: 5,
      y2: 6,
      z2: 7,
    });
    expect(line.colour).toEqual(1);
    expect(line.x1).toEqual(2);
    expect(line.y1).toEqual(3);
    expect(line.z1).toEqual(4);
    expect(line.x2).toEqual(5);
    expect(line.y2).toEqual(6);
    expect(line.z2).toEqual(7);
  });
});
