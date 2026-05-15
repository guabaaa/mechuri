import {
  DISTRICTS,
  MOOD_MENU_BOOST,
  NEARBY_MESSAGES,
  NEARBY_MENUS,
  seedPlaces,
  type NearbyMood,
  type WalkRadiusMin,
} from '../data/nearby';

function pickRandom<T extends string>(pool: readonly T[], exclude?: string): T {
  const list = exclude ? pool.filter((m) => m !== exclude) : [...pool];
  const arr = list.length > 0 ? list : [...pool];
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function buildMenuPool(areaType: keyof typeof NEARBY_MENUS, mood?: NearbyMood) {
  const base = [...NEARBY_MENUS[areaType]];
  if (!mood) {
    return base;
  }
  const boost = new Set(MOOD_MENU_BOOST[mood]);
  const preferred = base.filter((m) => boost.has(m));
  const rest = base.filter((m) => !boost.has(m));
  return [...preferred, ...preferred, ...rest];
}

export function getNearbyDistricts() {
  return DISTRICTS.map(({ id, label }) => ({ id, label }));
}

export function pickNearbyMenu(params: {
  districtId: string;
  radiusWalkMin?: WalkRadiusMin;
  mood?: NearbyMood;
  exclude?: string;
}) {
  const district = DISTRICTS.find((d) => d.id === params.districtId);
  if (!district) {
    return null;
  }

  const walkMin = params.radiusWalkMin ?? 10;
  const pool = buildMenuPool(district.areaType, params.mood);
  const menu = pickRandom(pool, params.exclude);
  const message =
    NEARBY_MESSAGES[Math.floor(Math.random() * NEARBY_MESSAGES.length)]!;
  const places = seedPlaces(
    district.areaType,
    district.label,
    menu,
    walkMin,
  );

  return {
    menu,
    message,
    areaLabel: `${district.label} · 도보 ${walkMin}분`,
    districtId: district.id,
    districtLabel: district.label,
    radiusWalkMin: walkMin,
    places,
  };
}
