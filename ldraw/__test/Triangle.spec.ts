import { Triangle } from '../src/Triangle';

describe('Triangle', () => {
  it('should have a default constructor', () => {
    const triangle = new Triangle();
    expect(triangle.colour).toEqual(0);
    expect(triangle.x1).toEqual(0);
    expect(triangle.y1).toEqual(0);
    expect(triangle.z1).toEqual(0);
    expect(triangle.x2).toEqual(0);
    expect(triangle.y2).toEqual(0);
    expect(triangle.z2).toEqual(0);
  });

  it('should have a constructor with partial props.', () => {
    const triangle = new Triangle({ colour: 1 });
    expect(triangle.colour).toEqual(1);
  });

  it('should have a constructor with props', () => {
    const triangle = new Triangle({
      lineNo: 0,
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
    });
    expect(triangle.colour).toEqual(1);
    expect(triangle.x1).toEqual(2);
    expect(triangle.y1).toEqual(3);
    expect(triangle.z1).toEqual(4);
    expect(triangle.x2).toEqual(5);
    expect(triangle.y2).toEqual(6);
    expect(triangle.z2).toEqual(7);
  });
});
