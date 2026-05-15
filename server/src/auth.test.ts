import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DELIVERY_BRANDS } from './data/deliveryBrands';
import { pickDeliveryMenu } from './services/menuService';
import {
  getUserByToken,
  socialSignIn,
} from './services/authService';

describe('deliveryBrands', () => {
  it('has many franchise names', () => {
    assert.ok(DELIVERY_BRANDS.length >= 80);
    assert.ok(DELIVERY_BRANDS.includes('교촌치킨'));
  });

  it('pickDeliveryMenu returns brand', () => {
    const result = pickDeliveryMenu();
    assert.equal(result.kind, 'brand');
    assert.ok(DELIVERY_BRANDS.includes(result.menu as (typeof DELIVERY_BRANDS)[number]));
  });
});

describe('authService', () => {
  it('creates session for guest', async () => {
    const { token, user } = await socialSignIn({ provider: 'guest' });
    assert.ok(token.length > 10);
    assert.equal(user.provider, 'guest');
    assert.ok(getUserByToken(token));
  });

  it('creates session with skip verify for social providers', async () => {
    process.env.AUTH_SKIP_VERIFY = 'true';
    const { token, user } = await socialSignIn({
      provider: 'kakao',
      accessToken: 'fake-token-for-test',
    });
    assert.equal(user.provider, 'kakao');
    assert.ok(user.nickname.length > 0);
    assert.ok(getUserByToken(token));
    delete process.env.AUTH_SKIP_VERIFY;
  });
});
