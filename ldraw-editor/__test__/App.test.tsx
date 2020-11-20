import React from 'react';
import renderer from 'react-test-renderer';

import App from 'ldraw-editor/src/App';

const { act } = renderer;

describe('App.tsx', () => {
  it('should render', async () => {
    await act(async () => {
      renderer.create(<App />);
    });
  });
});
