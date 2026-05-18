/** 메비티아이 결과 페르소나 DB */

export type PersonaKey =
  | 'hearty'
  | 'quick'
  | 'adventure'
  | 'light'
  | 'spicy'
  | 'sweet'
  | 'social'
  | 'comfort'
  | 'budget'
  | 'night'
  | 'health'
  | 'brunch'
  | 'noodle'
  | 'rice'
  | 'delivery'
  | 'picky';

export type PersonaResult = {
  title: string;
  subtitle: string;
  emoji: string;
  body: string;
  traits: string[];
  menus: string[];
  mechuriTip: string;
};

export const PERSONA_RESULTS: Record<PersonaKey, PersonaResult> = {
  hearty: {
    title: '국밥 안정형',
    subtitle: '든든함이 곧 행복',
    emoji: '🍲',
    body:
      '배고픔을 참지 못하고, 검증된 맛에서 안정감을 찾아요. 메뉴 실패는 최악의 시나리오—오늘도 국물 한 그릇으로 힘내요.',
    traits: ['포만감 우선', '단골집 애정', '실패 싫어함'],
    menus: ['돼지국밥', '순대국', '설렁탕'],
    mechuriTip: '오늘은 국밥집 단골 메뉴로 가보세요. 변화보다 만족이 먼저예요.',
  },
  quick: {
    title: '효율 실속형',
    subtitle: '시간이 곧 맛',
    emoji: '⚡',
    body:
      '점심 30분 안에 끝내는 게 미션. 빠르고 합리적인 선택이 몸에 배어 있어요.',
    traits: ['시간 절약', '간편식 달인', '결정 빠름'],
    menus: ['편의점 도시락', '삼각김밥', '컵라면'],
    mechuriTip: '웨이팅 없는 메뉴가 오늘의 정답이에요.',
  },
  adventure: {
    title: '맛집 탐험가',
    subtitle: '새 맛이 설렘',
    emoji: '🧭',
    body:
      '웨이팅도 즐기고, 처음 보는 메뉴에 두려움이 없어요. 인스타 저장 목록이 주식이에요.',
    traits: ['호기심 많음', '트렌드 민감', '도전 좋아함'],
    menus: ['마라탕', '회', '브런치 세트'],
    mechuriTip: '평소 안 가본 골목 맛집, 오늘 도전해 볼까요?',
  },
  light: {
    title: '가벼운 밸런스형',
    subtitle: '오후가 편해야 해',
    emoji: '🥗',
    body:
      '속 부담을 줄이고 다음 일정 컨디션을 지켜요. 건강한 선택이 자연스럽게 나와요.',
    traits: ['가볍게 먹기', '졸음 방지', '밸런스 중시'],
    menus: ['샐러드', '비빔밥', '순두부찌개'],
    mechuriTip: '기름진 메뉴 대신 국물·채소 비율 높은 한 끼 어때요?',
  },
  spicy: {
    title: '매운맛 화끈형',
    subtitle: '맵기로 리셋',
    emoji: '🌶️',
    body:
      '스트레스는 자극적인 맛으로 날려버려요. 매운 거 한 입이면 인생이 조금 풀려요.',
    traits: ['자극 선호', '화끈한 맛', '스트레스 해소'],
    menus: ['매운 닭갈비', '마라탕', '제육볶음'],
    mechuriTip: '오늘은 매운 단계 한 칸만 올려보세요. 기분 전환 확실해요.',
  },
  sweet: {
    title: '달달 위로형',
    subtitle: '당이 답이야',
    emoji: '🍰',
    body:
      '기분 전환엔 달콤함! 디저트가 밥이 될 수 있다고 믿는 낭만파예요.',
    traits: ['디저트 사랑', '기분 전환', '달콤한 위로'],
    menus: ['팥빙수', '크로와상', '카페 브런치'],
    mechuriTip: '점심 후 작은 디저트 하나, 오후가 달라져요.',
  },
  social: {
    title: '함께 먹는 회식형',
    subtitle: '같이 먹을 때 제일 맛있어',
    emoji: '🍻',
    body:
      '혼밥도 괜찮지만, 같이 먹는 자리에서 에너지가 올라와요. 메뉴 결정도 기꺼이 나서요.',
    traits: ['단체 식사 선호', '분위기 메이커', '나눠 먹기 좋아함'],
    menus: ['삼겹살', '치킨', '족발'],
    mechuriTip: '동료·친구랑 나눠 먹기 좋은 메뉴가 오늘의 행운이에요.',
  },
  comfort: {
    title: '집밥 향수형',
    subtitle: '익숙한 맛이 최고',
    emoji: '🏠',
    body:
      '어릴 때 먹던 맛, 따뜻하고 정겨운 음식이 최고예요. 엄마 손맛을 찾아 헤매는 타입.',
    traits: ['정겨운 맛', '집밥 그리움', '익숙함 선호'],
    menus: ['된장찌개', '제육덮밥', '김치볶음밥'],
    mechuriTip: '집 근처 분식·한식당이 오늘 당신의 안식처예요.',
  },
  budget: {
    title: '가성비 끝판왕형',
    subtitle: '만원의 행복',
    emoji: '💰',
    body:
      '맛과 가격의 밸런스를 계산해요. 비싼 건 가끔, 평소엔 합리적인 한 끼가 정석.',
    traits: ['가격 비교', '알뜰 식사', '만족도 계산'],
    menus: ['김밥천국', '분식 정식', '참치마요 덮밥'],
    mechuriTip: '오늘은 만원 이하 든든한 메뉴를 골라보세요.',
  },
  night: {
    title: '야식 요정형',
    subtitle: '밤이 진짜 식사 시간',
    emoji: '🌙',
    body:
      '낮보다 밤에 입맛이 살아나요. 야근·야식이 일상인 당신에게 치킨은 의식이에요.',
    traits: ['야식 러버', '늦은 시간 OK', '간식+본식'],
    menus: ['치킨', '라면', '야식 떡볶이'],
    mechuriTip: '너무 늦었다면 가벼운 야식으로, 내일 컨디션도 챙겨요.',
  },
  health: {
    title: '웰빙 관리형',
    subtitle: '몸이 먼저',
    emoji: '🥦',
    body:
      '영양·칼로리를 의식하면서도 맛은 포기하지 않아요. 건강한 한 끼가 습관이에요.',
    traits: ['영양 고려', '채소 좋아함', '꾸준한 관리'],
    menus: ['닭가슴 샐러드', '연어 덮밥', '두부 스테이크'],
    mechuriTip: '단백질+채소 한 접시, 오늘의 웰빙 점수 UP!',
  },
  brunch: {
    title: '브런치 감성형',
    subtitle: '느긋한 한 끼의 여유',
    emoji: '☕',
    body:
      '카페 분위기와 예쁜 플레이팅을 좋아해요. 먹는 것도 경험이라고 생각해요.',
    traits: ['분위기 중시', '카페 애정', '사진 각'],
    menus: ['에그 베네딕트', '팬케이크', '아보카도 토스트'],
    mechuriTip: '점심을 브런치 카페로—오늘은 여유가 포인트예요.',
  },
  noodle: {
    title: '면 요리 러버형',
    subtitle: '면이면 다 OK',
    emoji: '🍜',
    body:
      '국수·라면·파스타 가리지 않아요. 면 국물 한 모금이면 하루가 정리되는 타입.',
    traits: ['면 종류 다양', '국물 사랑', '빠른 만족'],
    menus: ['칼국수', '라멘', '비빔국수'],
    mechuriTip: '오늘은 면 메뉴로—국물 온도까지 챙겨보세요.',
  },
  rice: {
    title: '밥심 절대형',
    subtitle: '밥이 없으면 식사 아님',
    emoji: '🍚',
    body:
      '밥 한 공기가 있어야 식사라고 느껴요. 덮밥·비빔밥·정식이 최애예요.',
    traits: ['밥 필수', '든든한 탄수화물', '한식 정석'],
    menus: ['제육덮밥', '돌솥비빔밥', '가츠동'],
    mechuriTip: '밥 추가 가능한 메뉴가 오늘 당신과 찰떡이에요.',
  },
  delivery: {
    title: '배달 VIP형',
    subtitle: '앱 켜면 끝',
    emoji: '🛵',
    body:
      '나가기 귀찮을 땐 배달이 정답. 단골 가게·쿠폰까지 챙기는 프로예요.',
    traits: ['배달 앱 숙련', '집에서 편하게', '리뷰 참고'],
    menus: ['마라샹궈', '피자', '떡볶이'],
    mechuriTip: '평소 찜해 둔 배달 메뉴, 오늘은 그걸로 결정!',
  },
  picky: {
    title: '메뉴 결정 장인형',
    subtitle: '고르는 데 진심',
    emoji: '🤔',
    body:
      '메뉴판을 10분 넘게 보면서도 결국 만족스러운 선택을 해요. 신중함이 무기예요.',
    traits: ['비교·검색', '리뷰 확인', '후회 싫음'],
    menus: ['쌀국수', '카레', '포케'],
    mechuriTip: '후보 3개만 적고 룰렛—고민 시간을 줄여보세요.',
  },
};

export const PERSONA_KEYS = Object.keys(PERSONA_RESULTS) as PersonaKey[];
