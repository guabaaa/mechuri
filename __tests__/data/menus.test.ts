import { ALL_MENUS, pickRandom } from '../../src/data/menus';

describe('pickRandom', () => {
  it('returns a menu from the pool', () => {
    const result = pickRandom(ALL_MENUS);
    expect(ALL_MENUS).toContain(result);
  });

  it('excludes the given menu when possible', () => {
    const exclude = ALL_MENUS[0]!;
    const results = new Set(
      Array.from({ length: 30 }, () => pickRandom(ALL_MENUS, exclude)),
    );
    expect(results.has(exclude)).toBe(false);
  });
});
