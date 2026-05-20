import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { haversineMeters, normalizeKoreaCoords } from './utils/geo';

describe('geo', () => {
  it('detects swapped lat/lng', () => {
    const { lat, lng, swapped } = normalizeKoreaCoords(127.028, 37.498);
    assert.equal(swapped, true);
    assert.ok(Math.abs(lat - 37.498) < 0.001);
    assert.ok(Math.abs(lng - 127.028) < 0.001);
  });

  it('haversine gangnam short distance', () => {
    const d = haversineMeters(37.498, 127.028, 37.499, 127.029);
    assert.ok(d > 0 && d < 500);
  });
});
