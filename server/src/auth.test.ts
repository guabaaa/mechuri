import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DELIVERY_BRANDS, DELIVERY_DESSERT_BRANDS } from './data/deliveryBrands';
import { pickDeliveryMenu } from './services/menuService';
import {
  getUserByToken,
  socialSignIn,
  toAuthUserResponse,
  updateUserNickname,
} from './services/authService';

describe('deliveryBrands', () => {
  it('has many franchise names', () => {
    assert.ok(DELIVERY_BRANDS.length >= 80);
    assert.ok(DELIVERY_BRANDS.includes('교촌치킨'));
  });

  it('pickDeliveryMenu returns brand', () => {
    const result = pickDeliveryMenu();
    assert.equal(result.kind, 'brand');
    assert.equal(result.category, 'meal');
    assert.ok(DELIVERY_BRANDS.includes(result.menu as (typeof DELIVERY_BRANDS)[number]));
  });

  it('pickDeliveryMenu respects dessert category', () => {
    const result = pickDeliveryMenu(undefined, 'dessert');
    assert.equal(result.category, 'dessert');
    assert.ok(
      DELIVERY_DESSERT_BRANDS.includes(
        result.menu as (typeof DELIVERY_DESSERT_BRANDS)[number],
      ),
    );
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

    const naver = await socialSignIn({
      provider: 'naver',
      accessToken: 'fake-naver-token',
    });
    assert.equal(naver.user.provider, 'naver');
    assert.ok(getUserByToken(naver.token));
    delete process.env.AUTH_SKIP_VERIFY;
  });

  it('keeps custom nickname after re-login', async () => {
    process.env.AUTH_SKIP_VERIFY = 'true';
    const first = await socialSignIn({
      provider: 'kakao',
      accessToken: 'same-kakao-user',
    });
    const updated = updateUserNickname(first.token, '메추리짱');
    assert.ok(updated);
    assert.equal(updated?.nickname, '메추리짱');

    const second = await socialSignIn({
      provider: 'kakao',
      accessToken: 'same-kakao-user',
    });
    assert.equal(second.user.nickname, '메추리짱');
    delete process.env.AUTH_SKIP_VERIFY;
  });

  it('toAuthUserResponse includes joinedAt', async () => {
    const { user } = await socialSignIn({ provider: 'guest' });
    const res = toAuthUserResponse(user);
    assert.ok(res.joinedAt);
  });
});
