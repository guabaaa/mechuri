import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fetchStaticMapImage } from './services/kakaoMapService';

describe('static map', () => {
  it('returns fallback map when kakao key is missing', async () => {
    const prev = process.env.KAKAO_REST_API_KEY;
    delete process.env.KAKAO_REST_API_KEY;

    const image = await fetchStaticMapImage({
      lat: 37.5665,
      lng: 126.978,
      width: 400,
      height: 220,
    });

    if (prev) {
      process.env.KAKAO_REST_API_KEY = prev;
    }

    assert.ok(image, 'expected map image');
    assert.ok(image!.buffer.length > 100);
    assert.equal(image!.source, 'fallback');
  });
});
