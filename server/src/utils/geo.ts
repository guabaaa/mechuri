/** 한국 위·경도 범위 (대략) */
const KOREA_LAT = { min: 33, max: 39.5 };
const KOREA_LNG = { min: 124, max: 132 };

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** GPS에서 위·경도가 뒤바뀐 경우 보정 (한국 기준) */
export function isInKorea(lat: number, lng: number): boolean {
  return (
    lat >= KOREA_LAT.min &&
    lat <= KOREA_LAT.max &&
    lng >= KOREA_LNG.min &&
    lng <= KOREA_LNG.max
  );
}

export function normalizeKoreaCoords(
  lat: number,
  lng: number,
): { lat: number; lng: number; swapped: boolean } {
  const latOk = lat >= KOREA_LAT.min && lat <= KOREA_LAT.max;
  const lngOk = lng >= KOREA_LNG.min && lng <= KOREA_LNG.max;
  if (latOk && lngOk) {
    return { lat, lng, swapped: false };
  }
  const swappedLat = lng;
  const swappedLng = lat;
  const swappedOk =
    swappedLat >= KOREA_LAT.min &&
    swappedLat <= KOREA_LAT.max &&
    swappedLng >= KOREA_LNG.min &&
    swappedLng <= KOREA_LNG.max;
  if (swappedOk) {
    return { lat: swappedLat, lng: swappedLng, swapped: true };
  }
  return { lat, lng, swapped: false };
}
