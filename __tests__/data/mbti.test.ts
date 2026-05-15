import { resolvePersona } from '../../src/data/mbti';

describe('resolvePersona', () => {
  it('picks the persona with the highest count', () => {
    expect(
      resolvePersona({ hearty: 3, quick: 1, light: 2 }),
    ).toBe('hearty');
  });

  it('returns hearty when counts are empty', () => {
    expect(resolvePersona({})).toBe('hearty');
  });
});
