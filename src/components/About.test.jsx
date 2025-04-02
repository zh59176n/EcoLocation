// src/components/About.test.jsx
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import About from './About';

afterEach(cleanup);

describe('About', () => {
  test('has no accessibility violations', async () => {
    const { container } = render(<About />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
