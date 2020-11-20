import { Quad } from '../src/Quad';

describe('Quad', () => {
  it('should have a default constructor', () => {
    const quad = new Quad();
    expect(quad.colour).toEqual(0);
    expect(quad.x1).toEqual(0);
    expect(quad.y1).toEqual(0);
    expect(quad.z1).toEqual(0);
    expect(quad.x2).toEqual(0);
    expect(quad.y2).toEqual(0);
    expect(quad.z2).toEqual(0);
  });

  it('should have a constructor with partial props.', () => {
    const quad = new Quad({ colour: 1 });
    expect(quad.colour).toEqual(1);
  });

  it('should have a constructor with props', () => {
    const quad = new Quad({
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
    expect(quad.colour).toEqual(1);
    expect(quad.x1).toEqual(2);
    expect(quad.y1).toEqual(3);
    expect(quad.z1).toEqual(4);
    expect(quad.x2).toEqual(5);
    expect(quad.y2).toEqual(6);
    expect(quad.z2).toEqual(7);
  });
});
