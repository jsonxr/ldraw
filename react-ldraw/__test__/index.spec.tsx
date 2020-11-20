import React from 'react';
import { create, act } from 'react-test-renderer';
import { LDrawProvider } from 'react-ldraw/src/ReactLDraw';

describe('LDrawProvider', () => {
  it('should render', async () => {
    await act(async () => {
      const component = create(
        <LDrawProvider>
          <></>
        </LDrawProvider>
      );
      expect(component).toBeTruthy();
    });
  });
});
