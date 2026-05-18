import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  hasRequiredConsents,
  recordUserConsents,
} from './services/consentService';
import type { AuthUserRecord } from './services/authService';

const user: AuthUserRecord = {
  id: 'test-user-consent',
  provider: 'guest',
  nickname: '테스트',
  createdAt: Date.now(),
};

describe('consentService', () => {
  it('has no consents before record', () => {
    assert.equal(hasRequiredConsents(user), false);
  });

  it('has consents after record', () => {
    recordUserConsents(user.id);
    assert.equal(hasRequiredConsents(user), true);
  });
});
