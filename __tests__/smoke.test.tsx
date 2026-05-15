import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { AuthProvider } from '../src/context/AuthContext';
import { SITUATIONS } from '../src/data/situations';

describe('situations data', () => {
  it('has unique ids', () => {
    const ids = SITUATIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each situation has at least one menu', () => {
    for (const s of SITUATIONS) {
      expect(s.menus.length).toBeGreaterThan(0);
    }
  });
});

describe('AuthProvider', () => {
  it('renders children', async () => {
    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <AuthProvider>
          <></>
        </AuthProvider>,
      );
    });
  });
});
