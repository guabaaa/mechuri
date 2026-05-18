import type { NearbyPlace } from '../api/types';
import KakaoStaticMap from './KakaoStaticMap';

type Props = {
  userLat: number;
  userLng: number;
  places?: NearbyPlace[];
  height?: number;
};

/** 카카오 정적 지도 (서버가 REST API 키로 이미지 생성) */
export default function NearbyLocationPanel(props: Props) {
  return <KakaoStaticMap {...props} />;
}
