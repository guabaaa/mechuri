import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pickNearbyMenu, getNearbyDistricts } from './services/nearbyService';

describe('nearbyService', () => {
  it('returns districts', () => {
    const list = getNearbyDistricts();
    assert.ok(list.length >= 4);
  });

  it('picks menu for valid district', () => {
    const result = pickNearbyMenu({
      districtId: 'gangnam',
      radiusWalkMin: 10,
      mood: 'solo',
    });
    assert.ok(result);
    assert.ok(result!.menu.length > 0);
    assert.equal(result!.places.length, 3);
    assert.match(result!.areaLabel, /강남/);
  });

  it('returns null for unknown district', () => {
    assert.equal(pickNearbyMenu({ districtId: 'unknown' }), null);
  });
});
