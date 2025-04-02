// src/components/Home.test.jsx
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import Home from './Home';

afterEach(cleanup);

describe('Home', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
