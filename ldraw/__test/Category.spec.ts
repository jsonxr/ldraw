import { isCategory } from '../src/Category';

describe('Category', () => {
  describe('isCategory', () => {
    it('should return false if undefined or null', () => {
      expect(isCategory(undefined)).toBeFalsy();
      expect(isCategory(null)).toBeFalsy();
    });
    it('should return false if value is not in category list', () => {
      expect(isCategory('Fake')).toBeFalsy();
    });
    it('should return true value is a valid category', () => {
      expect(isCategory('Brick')).toBeTruthy();
    });
  });
});
