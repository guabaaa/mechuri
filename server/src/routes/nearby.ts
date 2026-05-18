import { Router } from 'express';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler';
import { getNearbyDistricts, pickNearbyMenu } from '../services/nearbyService';
import { fetchStaticMapImage } from '../services/kakaoMapService';
import { pickNearbyAtLocation } from '../services/nearbyLocationService';

const router = Router();

router.get('/map-static', async (req, res, next) => {
  try {
    const schema = z.object({
      lat: z.coerce.number().min(-90).max(90),
      lng: z.coerce.number().min(-180).max(180),
      w: z.coerce.number().min(100).max(1280).optional(),
      h: z.coerce.number().min(100).max(1280).optional(),
      markers: z.string().optional(),
    });
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '지도 좌표가 올바르지 않아요.');
    }
    const markerList = parsed.data.markers
      ? parsed.data.markers.split(';').map((part, i) => {
          const [lat, lng] = part.split(',').map(Number);
          return { lat, lng, label: String(i + 1) };
        }).filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng))
      : [];

    const image = await fetchStaticMapImage({
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      width: parsed.data.w,
      height: parsed.data.h,
      markers: markerList,
    });

    if (!image) {
      throw new ApiError(502, 'MAP_ERROR', '카카오 지도를 불러오지 못했어요.');
    }

    res.set('Content-Type', image.contentType);
    res.set('Cache-Control', 'private, max-age=120');
    res.set('X-Mechuri-Map-Source', image.source);
    res.send(image.buffer);
  } catch (e) {
    next(e);
  }
});

router.get('/districts', (_req, res) => {
  res.json({ data: getNearbyDistricts() });
});

router.post('/pick', async (req, res, next) => {
  try {
    const gpsSchema = z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
      radiusWalkMin: z.union([z.literal(5), z.literal(10), z.literal(15)]).optional(),
      mood: z.enum(['solo', 'team', 'light', 'hearty']).optional(),
      exclude: z.string().optional(),
    });

    const legacySchema = z.object({
      districtId: z.string().min(1),
      radiusWalkMin: z.union([z.literal(5), z.literal(10), z.literal(15)]).optional(),
      mood: z.enum(['solo', 'team', 'light', 'hearty']).optional(),
      exclude: z.string().optional(),
    });

    const body = req.body ?? {};
    const gpsParsed = gpsSchema.safeParse(body);
    if (gpsParsed.success && gpsParsed.data.lat != null) {
      const result = await pickNearbyAtLocation(gpsParsed.data);
      if (!result) {
        throw new ApiError(
          404,
          'NOT_FOUND',
          '근처 음식점을 찾지 못했어요. 서버에 KAKAO_REST_API_KEY 를 설정해 주세요.',
        );
      }
      res.json({ data: result });
      return;
    }

    const legacyParsed = legacySchema.safeParse(body);
    if (!legacyParsed.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', '위치 정보가 올바르지 않아요.');
    }

    const result = pickNearbyMenu({
      districtId: legacyParsed.data.districtId,
      radiusWalkMin: legacyParsed.data.radiusWalkMin,
      mood: legacyParsed.data.mood,
      exclude: legacyParsed.data.exclude,
    });

    if (!result) {
      throw new ApiError(404, 'NOT_FOUND', '동네를 찾을 수 없어요.');
    }

    res.json({ data: result });
  } catch (e) {
    next(e);
  }
});

export default router;
