import {
  formatBirthdayInput,
  parseBirthdayInput,
  toBirthdayPayload,
} from '../../src/utils/date';

describe('date utils', () => {
  it('parses and formats birthday', () => {
    const d = parseBirthdayInput('1995.06.15');
    expect(d).not.toBeNull();
    expect(formatBirthdayInput(d!)).toBe('1995. 06. 15.');
    expect(toBirthdayPayload(d!)).toBe('1995-06-15');
  });
});
