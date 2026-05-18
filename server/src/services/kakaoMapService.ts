import { getKakaoRestApiKey } from '../config/kakaoKey';
import { fetchFallbackStaticMapImage } from './mapFallbackService';

export function buildStaticMapUrl(params: {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  level?: number;
  markers?: { lat: number; lng: number; label?: string }[];
}) {
  const url = new URL('https://dapi.kakao.com/v2/maps/staticimage');
  url.searchParams.set('center', `${params.lng},${params.lat}`);
  url.searchParams.set('level', String(params.level ?? 5));
  url.searchParams.set('w', String(Math.min(params.width ?? 400, 1280)));
  url.searchParams.set('h', String(Math.min(params.height ?? 220, 1280)));

  if (params.markers?.length) {
    const markerParts = params.markers.map((m, i) => {
      const label = m.label ?? String(i + 1);
      return `size:small,color:0xFF6B00,label:${label}|${m.lat},${m.lng}`;
    });
    url.searchParams.set('markers', markerParts.join('|'));
  }

  return url.toString();
}

export async function fetchStaticMapImage(params: {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  level?: number;
  markers?: { lat: number; lng: number; label?: string }[];
}): Promise<{ buffer: Buffer; contentType: string; source: 'kakao' | 'fallback' } | null> {
  const restKey = getKakaoRestApiKey();
  if (restKey) {
    const mapUrl = buildStaticMapUrl(params);
    const res = await fetch(mapUrl, {
      headers: { Authorization: `KakaoAK ${restKey}` },
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') ?? 'image/png';
      const arrayBuffer = await res.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType,
        source: 'kakao',
      };
    }
  }

  const fallback = await fetchFallbackStaticMapImage({
    lat: params.lat,
    lng: params.lng,
    width: params.width,
    height: params.height,
    markers: params.markers,
  });
  if (!fallback) {
    return null;
  }
  return { ...fallback, source: 'fallback' };
}
