import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildFortuneFromBirthday,
  parseBirthday,
} from './services/fortuneService';
import {
  getCurrentSet,
  getIsoWeek,
  getSetIndexForDate,
  getWeekLabel,
  MEVITIAI_SETS,
  resolvePersona,
} from './data/mevitiAI';
import { PERSONA_KEYS } from './data/personas';
import { getWeeklyQuestions, resolveMbtiResult } from './services/mbtiService';

describe('fortuneService', () => {
  it('parses birthday', () => {
    const d = parseBirthday('1995-06-15');
    assert.equal(d.getFullYear(), 1995);
  });

  it('is deterministic per day', () => {
    const birthday = new Date(1995, 5, 15);
    const today = new Date(2026, 4, 14);
    const a = buildFortuneFromBirthday(birthday, today);
    const b = buildFortuneFromBirthday(birthday, today);
    assert.equal(a.score, b.score);
    assert.equal(a.topPick, b.topPick);
  });
});

describe('mevitiAI', () => {
  it('getIsoWeek returns a valid week number', () => {
    const week = getIsoWeek(new Date(2026, 4, 15));
    assert.ok(week >= 1 && week <= 53, `week ${week} out of range`);
  });

  it('getSetIndexForDate cycles within MEVITIAI_SETS length', () => {
    const idx = getSetIndexForDate(new Date(2026, 4, 15));
    assert.ok(idx >= 0 && idx < MEVITIAI_SETS.length);
  });

  it('getCurrentSet returns a set with 6 questions', () => {
    const set = getCurrentSet(new Date(2026, 4, 15));
    assert.equal(set.questions.length, 6);
    assert.ok(set.setId.startsWith('set-'));
  });

  it('getWeekLabel contains year and 주차', () => {
    const label = getWeekLabel(new Date(2026, 4, 15));
    assert.ok(label.includes('2026'));
    assert.ok(label.includes('주차'));
  });

  it('different weeks return different sets', () => {
    const sets = MEVITIAI_SETS;
    const week1 = getSetIndexForDate(new Date(2026, 0, 5));
    const week2 = getSetIndexForDate(new Date(2026, 0, 12));
    // 1주 차이이므로 인덱스가 달라야 함
    assert.notEqual(week1, week2);
  });

  it('getWeeklyQuestions includes weekLabel and setId', () => {
    const data = getWeeklyQuestions(new Date(2026, 4, 15));
    assert.ok(data.weekLabel.includes('주차'));
    assert.ok(data.setId.startsWith('set-'));
    assert.equal(data.questions.length, 6);
  });

  it('has 16 persona results in DB', () => {
    assert.equal(PERSONA_KEYS.length, 16);
  });

  it('resolveMbtiResult returns extended fields', () => {
    const r = resolveMbtiResult({ spicy: 3, hearty: 1 });
    assert.equal(r.personaKey, 'spicy');
    assert.ok(r.emoji);
    assert.equal(r.traits.length, 3);
    assert.ok(r.mechuriTip);
  });

  it('resolvePersona picks highest count', () => {
    assert.equal(resolvePersona({ delivery: 2, quick: 1 }), 'delivery');
  });
});
