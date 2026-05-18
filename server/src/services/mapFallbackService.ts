/** 카카오 REST 키 없을 때 정적 지도 대체 (OpenStreetMap 타일) */

const OSM_USER_AGENT = 'Mechuri/1.0 (nearby-map-fallback)';

function latLngToTile(lat: number, lng: number, zoom: number) {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return { x, y, zoom };
}

export async function fetchFallbackStaticMapImage(params: {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  markers?: { lat: number; lng: number }[];
}): Promise<{ buffer: Buffer; contentType: string } | null> {
  const zoom = 16;
  const { x, y } = latLngToTile(params.lat, params.lng, zoom);
  const tileUrl = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

  try {
    const res = await fetch(tileUrl, {
      headers: { 'User-Agent': OSM_USER_AGENT },
    });
    if (!res.ok) {
      return null;
    }
    const contentType = res.headers.get('content-type') ?? 'image/png';
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength < 100) {
      return null;
    }
    return { buffer: Buffer.from(arrayBuffer), contentType };
  } catch {
    return null;
  }
}
