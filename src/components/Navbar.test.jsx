// src/components/Navbar.test.jsx
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe } from 'jest-axe';
import Navbar from './Navbar';
import { BrowserRouter as Router } from 'react-router-dom';

afterEach(cleanup);

describe('Navbar', () => {
  test('has no accessibility violations', async () => {
    // Wrap in Router since Navbar uses Link components.
    const { container } = render(
      <Router>
        <Navbar darkMode={false} setDarkMode={() => {}} />
      </Router>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
