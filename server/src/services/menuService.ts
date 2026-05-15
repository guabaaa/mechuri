import { DELIVERY_BRAND_MESSAGES, DELIVERY_BRANDS } from '../data/deliveryBrands';
import {
  ALL_MENUS,
  ROULETTE_POOL,
  TODAY_MESSAGES,
} from '../data/menus';
import { SITUATIONS } from '../data/situations';

function pickRandom<T extends string>(pool: readonly T[], exclude?: string): T {
  const list = exclude ? pool.filter((m) => m !== exclude) : [...pool];
  const arr = list.length > 0 ? list : [...pool];
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function getMenuPool() {
  return {
    menus: [...ALL_MENUS],
    roulettePool: [...ROULETTE_POOL],
    deliveryPool: [...DELIVERY_BRANDS],
  };
}

export function pickDeliveryMenu(exclude?: string) {
  const brand = pickRandom(DELIVERY_BRANDS, exclude);
  const message =
    DELIVERY_BRAND_MESSAGES[
      Math.floor(Math.random() * DELIVERY_BRAND_MESSAGES.length)
    ]!;
  return { menu: brand, message, kind: 'brand' as const };
}

export function pickTodayMenu(exclude?: string) {
  const menu = pickRandom(ALL_MENUS, exclude);
  const message =
    TODAY_MESSAGES[Math.floor(Math.random() * TODAY_MESSAGES.length)]!;
  return { menu, message };
}

export function getSituations() {
  return SITUATIONS.map(({ id, title, hint }) => ({ id, title, hint }));
}

export function pickSituationMenu(situationId: string) {
  const situation = SITUATIONS.find((s) => s.id === situationId);
  if (!situation) {
    return null;
  }
  const menu = pickRandom([...situation.menus]);
  return {
    menu,
    message: situation.message,
    situationId: situation.id,
    situationTitle: situation.title,
  };
}

export function spinRoulette(excluded: string[] = []) {
  const excludedSet = new Set(excluded);
  const pool = ROULETTE_POOL.filter((m) => !excludedSet.has(m));
  const menu = pickRandom(pool.length > 0 ? pool : ROULETTE_POOL);
  return {
    menu,
    message: '룰렛이 정해준 오늘의 메뉴예요!',
  };
}
