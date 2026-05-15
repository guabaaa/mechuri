/**
 * 메비티아이 (MeVITI-AI) — 주차별 음식 성향 테스트 세트
 * 총 4종. 주차(ISO week) % 4 로 순환.
 */

export type MevQuestion = {
  id: string;
  title: string;
  options: { id: string; label: string; persona: string }[];
};

export type MevSet = {
  setId: string;
  title: string;
  description: string;
  questions: MevQuestion[];
};

export type PersonaKey =
  | 'hearty'
  | 'quick'
  | 'adventure'
  | 'light'
  | 'spicy'
  | 'sweet'
  | 'social'
  | 'comfort';

export const PERSONA_RESULTS: Record<
  PersonaKey,
  { title: string; body: string; menus: string[] }
> = {
  hearty: {
    title: '국밥 안정형',
    body: '든든한 한 끼에서 안정감을 찾는 타입이에요. 메뉴 실패를 극도로 싫어하고, 검증된 맛을 선호해요. 오늘도 힘내세요!',
    menus: ['돼지국밥', '순대국', '설렁탕'],
  },
  quick: {
    title: '효율 편의점형',
    body: '시간 대비 만족을 최우선으로 생각해요. 빠르고 합리적인 선택이 몸에 배어 있어요.',
    menus: ['편의점 도시락', '삼각김밥', '컵라면'],
  },
  adventure: {
    title: '맛집 탐험가',
    body: '웨이팅도 즐기고, 새로운 메뉴에 두려움이 없어요. 인스타 맛집이 주식(?)이에요.',
    menus: ['마라탕', '회', '브런치 세트'],
  },
  light: {
    title: '밸런스 가벼운 한 끼형',
    body: '속 부담을 줄이고 오후 컨디션을 지키는 스타일이에요. 건강한 선택을 자연스럽게 해요.',
    menus: ['샐러드', '비빔밥', '순두부찌개'],
  },
  spicy: {
    title: '스트레스 불태우는 매운맛형',
    body: '자극적인 맛으로 스트레스를 확 날려버리는 타입이에요. 매운 거 먹으면 인생이 풀려요.',
    menus: ['매운 닭갈비', '마라탕', '제육볶음'],
  },
  sweet: {
    title: '당 충전 달달형',
    body: '기분 전환은 달달함으로! 디저트가 밥이 될 수 있다고 생각하는 낭만파예요.',
    menus: ['팥빙수', '크로와상', '카페 브런치'],
  },
  social: {
    title: '회식 리더형',
    body: '함께 먹는 것 자체를 즐기고, 단체 메뉴 결정을 기꺼이 나서서 해요. 분위기 메이커!',
    menus: ['삼겹살', '치킨', '족발'],
  },
  comfort: {
    title: '집밥 그리움형',
    body: '어릴 때 먹던 맛, 따뜻하고 정겨운 음식이 최고예요. 엄마 손맛을 찾아 헤매는 타입.',
    menus: ['된장찌개', '제육덮밥', '김치볶음밥'],
  },
};

/** ISO week number (1~53) */
export function getIsoWeek(date: Date = new Date()): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // 목요일 기준
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
}

export function getWeekLabel(date: Date = new Date()): string {
  const week = getIsoWeek(date);
  const year = date.getFullYear();
  return `${year}년 ${week}주차`;
}

/** 주차별 세트 인덱스 (0~3 순환) */
export function getSetIndexForDate(date: Date = new Date()): number {
  const week = getIsoWeek(date);
  const year = date.getFullYear();
  // 연도 * 100 + 주차를 4로 나눈 나머지로 순환
  return (year * 100 + week) % MEVITIAI_SETS.length;
}

export const MEVITIAI_SETS: MevSet[] = [
  {
    setId: 'set-a',
    title: '직장인 점심 유형 테스트',
    description: '오늘 점심, 당신은 어떤 유형인가요?',
    questions: [
      {
        id: 'a1',
        title: '점심시간이 30분밖에 없다. 당신의 선택은?',
        options: [
          { id: 'a', label: '빠르게 먹을 수 있는 국밥', persona: 'hearty' },
          { id: 'b', label: '편의점 도시락', persona: 'quick' },
          { id: 'c', label: '그래도 맛집 웨이팅', persona: 'adventure' },
          { id: 'd', label: '커피랑 빵으로 해결', persona: 'light' },
        ],
      },
      {
        id: 'a2',
        title: '월요일 점심, 지금 기분은?',
        options: [
          { id: 'a', label: '든든하게 먹고 버티기', persona: 'hearty' },
          { id: 'b', label: '가볍게, 졸음 줄이기', persona: 'light' },
          { id: 'c', label: '매운 걸로 홧김', persona: 'spicy' },
          { id: 'd', label: '달달한 디저트 땡김', persona: 'sweet' },
        ],
      },
      {
        id: 'a3',
        title: '팀원이 "뭐 먹지?"라고 한다면?',
        options: [
          { id: 'a', label: '내가 룰렛 돌려볼게', persona: 'adventure' },
          { id: 'b', label: '국밥 가실 분', persona: 'hearty' },
          { id: 'c', label: '다이어트 중이라 샐러드', persona: 'light' },
          { id: 'd', label: '오늘은 배달 각', persona: 'quick' },
        ],
      },
      {
        id: 'a4',
        title: '야근 전 한 끼, 우선순위는?',
        options: [
          { id: 'a', label: '포만감', persona: 'hearty' },
          { id: 'b', label: '속 편한 음식', persona: 'light' },
          { id: 'c', label: '짧은 시간', persona: 'quick' },
          { id: 'd', label: '기분 전환', persona: 'spicy' },
        ],
      },
      {
        id: 'a5',
        title: '회사 구내식당 vs 외부 식당, 당신은?',
        options: [
          { id: 'a', label: '밖에 나가서 제대로 먹자', persona: 'adventure' },
          { id: 'b', label: '구내식당이 빠르고 편해', persona: 'quick' },
          { id: 'c', label: '동료랑 밖에서 같이', persona: 'social' },
          { id: 'd', label: '집에서 싸온 도시락', persona: 'comfort' },
        ],
      },
      {
        id: 'a6',
        title: '점심 후 디저트 타임, 뭐가 땡기나요?',
        options: [
          { id: 'a', label: '아이스 아메리카노', persona: 'light' },
          { id: 'b', label: '케이크·마카롱', persona: 'sweet' },
          { id: 'c', label: '디저트는 스킵', persona: 'quick' },
          { id: 'd', label: '동료랑 카페 가서 수다', persona: 'social' },
        ],
      },
    ],
  },
  {
    setId: 'set-b',
    title: '나의 주말 먹킷리스트',
    description: '주말 식사 스타일로 음식 성향을 파악해요',
    questions: [
      {
        id: 'b1',
        title: '주말 아침, 눈 뜨면 가장 먼저 생각하는 것은?',
        options: [
          { id: 'a', label: '어디 브런치 맛집 가볼까', persona: 'adventure' },
          { id: 'b', label: '국 끓여서 밥 먹어야지', persona: 'comfort' },
          { id: 'c', label: '편의점 가서 간단히', persona: 'quick' },
          { id: 'd', label: '다이어트 스타트!', persona: 'light' },
        ],
      },
      {
        id: 'b2',
        title: '친구들이랑 주말 점심 약속, 어디 가자고 하나요?',
        options: [
          { id: 'a', label: '요즘 핫한 새로운 맛집', persona: 'adventure' },
          { id: 'b', label: '자주 가는 단골 국밥집', persona: 'hearty' },
          { id: 'c', label: '삼겹살 구워야지', persona: 'social' },
          { id: 'd', label: '분위기 좋은 카페 브런치', persona: 'sweet' },
        ],
      },
      {
        id: 'b3',
        title: '주말에 혼자 밥 먹게 됐을 때?',
        options: [
          { id: 'a', label: '오히려 좋아 — 평소 못 먹던 것', persona: 'adventure' },
          { id: 'b', label: '집에서 간단히 해먹어야지', persona: 'comfort' },
          { id: 'c', label: '편의점 or 배달로 빠르게', persona: 'quick' },
          { id: 'd', label: '다이어트 식단 실천', persona: 'light' },
        ],
      },
      {
        id: 'b4',
        title: '주말 저녁 회식이 잡혔다! 어떤 메뉴를 제안하나요?',
        options: [
          { id: 'a', label: '매운 거! 족발에 소주', persona: 'spicy' },
          { id: 'b', label: '삼겹살 구워요', persona: 'social' },
          { id: 'c', label: '나는 아무거나', persona: 'light' },
          { id: 'd', label: '분위기 있는 이자카야', persona: 'adventure' },
        ],
      },
      {
        id: 'b5',
        title: '주말 오후, 갑자기 배고파졌을 때?',
        options: [
          { id: 'a', label: '떡볶이·순대 길거리 간식', persona: 'spicy' },
          { id: 'b', label: '집 근처 단골 분식', persona: 'comfort' },
          { id: 'c', label: '배달 앱 켜서 빠르게', persona: 'quick' },
          { id: 'd', label: '과일·요거트로 가볍게', persona: 'light' },
        ],
      },
      {
        id: 'b6',
        title: '주말 저녁, 이상적인 한 끼는?',
        options: [
          { id: 'a', label: '가족이랑 집에서 든든하게', persona: 'comfort' },
          { id: 'b', label: '친구들이랑 고기 파티', persona: 'social' },
          { id: 'c', label: '혼자 영화 보며 치킨', persona: 'quick' },
          { id: 'd', label: '새로 연 파인다이닝', persona: 'adventure' },
        ],
      },
    ],
  },
  {
    setId: 'set-c',
    title: '스트레스받을 때 먹는 것',
    description: '힘든 날의 먹방으로 진짜 성향을 알 수 있어요',
    questions: [
      {
        id: 'c1',
        title: '일이 너무 많아서 터질 것 같을 때, 점심은?',
        options: [
          { id: 'a', label: '매운 라면으로 확 풀기', persona: 'spicy' },
          { id: 'b', label: '달달한 케이크 한 조각', persona: 'sweet' },
          { id: 'c', label: '그냥 굶어, 입맛 없어', persona: 'light' },
          { id: 'd', label: '든든한 국밥 한 뚝배기', persona: 'hearty' },
        ],
      },
      {
        id: 'c2',
        title: '야근이 예고됐다. 저녁 뭐 시키나요?',
        options: [
          { id: 'a', label: '치킨 먹으면 힘 나지', persona: 'social' },
          { id: 'b', label: '매운 떡볶이 세트', persona: 'spicy' },
          { id: 'c', label: '건강하게 샐러드', persona: 'light' },
          { id: 'd', label: '집밥 느낌 도시락', persona: 'comfort' },
        ],
      },
      {
        id: 'c3',
        title: '프로젝트 마감을 끝냈다! 회식 메뉴는?',
        options: [
          { id: 'a', label: '삼겹살에 소주 ㄱㄱ', persona: 'social' },
          { id: 'b', label: '고기 제대로 구워먹자', persona: 'hearty' },
          { id: 'c', label: '분위기 있는 레스토랑', persona: 'adventure' },
          { id: 'd', label: '달달한 케이크 파티', persona: 'sweet' },
        ],
      },
      {
        id: 'c4',
        title: '힘든 하루 끝에 혼자 편의점 간다. 뭐 고르나요?',
        options: [
          { id: 'a', label: '불닭볶음면 + 맥주', persona: 'spicy' },
          { id: 'b', label: '케이크 + 아이스크림', persona: 'sweet' },
          { id: 'c', label: '삼각김밥 두 개', persona: 'quick' },
          { id: 'd', label: '따뜻한 어묵 국물', persona: 'comfort' },
        ],
      },
      {
        id: 'c5',
        title: '상사한테 혼난 직후, 점심 메뉴는?',
        options: [
          { id: 'a', label: '매운 걸로 화풀이', persona: 'spicy' },
          { id: 'b', label: '달콤한 디저트로 위로', persona: 'sweet' },
          { id: 'c', label: '동료랑 수다 떨며 회복', persona: 'social' },
          { id: 'd', label: '입맛 없어서 가볍게', persona: 'light' },
        ],
      },
      {
        id: 'c6',
        title: '번아웃 온 것 같을 때, 음식으로 어떻게 회복하나요?',
        options: [
          { id: 'a', label: '엄마 손맛 같은 집밥', persona: 'comfort' },
          { id: 'b', label: '평소 안 먹던 특별한 맛', persona: 'adventure' },
          { id: 'c', label: '빨리 먹고 쉬는 게 우선', persona: 'quick' },
          { id: 'd', label: '든든한 국물 한 그릇', persona: 'hearty' },
        ],
      },
    ],
  },
  {
    setId: 'set-d',
    title: '음식 가치관 테스트',
    description: '먹는 것에 대한 철학이 성향을 말해줘요',
    questions: [
      {
        id: 'd1',
        title: '당신에게 "좋은 점심"이란?',
        options: [
          { id: 'a', label: '빠르고 배부르면 그만', persona: 'quick' },
          { id: 'b', label: '새롭고 맛있는 경험', persona: 'adventure' },
          { id: 'c', label: '건강하고 속 편한 것', persona: 'light' },
          { id: 'd', label: '푸짐하고 든든한 국밥', persona: 'hearty' },
        ],
      },
      {
        id: 'd2',
        title: '맛집 정보를 어디서 얻나요?',
        options: [
          { id: 'a', label: '인스타·유튜브 매일 검색', persona: 'adventure' },
          { id: 'b', label: '동네 단골 그냥 가요', persona: 'comfort' },
          { id: 'c', label: '회사 동료 추천', persona: 'social' },
          { id: 'd', label: '네이버 별점·리뷰 꼼꼼히', persona: 'quick' },
        ],
      },
      {
        id: 'd3',
        title: '메뉴 고르는 데 얼마나 걸리나요?',
        options: [
          { id: 'a', label: '1초도 안 걸려, 맨날 같은 것', persona: 'comfort' },
          { id: 'b', label: '5분은 기본, 신중해요', persona: 'light' },
          { id: 'c', label: '일단 맵고 자극적인 거', persona: 'spicy' },
          { id: 'd', label: '새로운 거 도전해보자', persona: 'adventure' },
        ],
      },
      {
        id: 'd4',
        title: '점심 혼밥 vs 함께 먹기, 당신은?',
        options: [
          { id: 'a', label: '혼밥 최고, 먹고 싶은 것 먹어', persona: 'quick' },
          { id: 'b', label: '같이 먹어야 맛있지', persona: 'social' },
          { id: 'c', label: '혼밥도 좋고 같이도 좋아', persona: 'light' },
          { id: 'd', label: '사람들 많은 맛집이 좋아', persona: 'adventure' },
        ],
      },
      {
        id: 'd5',
        title: '배달 vs 직접 방문, 당신의 선택은?',
        options: [
          { id: 'a', label: '배달이 최고, 시간 아껴', persona: 'quick' },
          { id: 'b', label: '직접 가서 먹는 게 맛있어', persona: 'adventure' },
          { id: 'c', label: '친구 집들이가 제일', persona: 'social' },
          { id: 'd', label: '집에서 직접 요리', persona: 'comfort' },
        ],
      },
      {
        id: 'd6',
        title: '음식에 돈을 쓸 때, 당신의 기준은?',
        options: [
          { id: 'a', label: '가성비 최우선', persona: 'quick' },
          { id: 'b', label: '맛이면 비싸도 OK', persona: 'adventure' },
          { id: 'c', label: '건강·영양이 먼저', persona: 'light' },
          { id: 'd', label: '양 많고 든든하면 됨', persona: 'hearty' },
        ],
      },
    ],
  },
];

/** 세트당 질문 수 (메비티아이 표준) */
export const QUESTIONS_PER_SET = 6;

export function getCurrentSet(date: Date = new Date()): MevSet {
  const idx = getSetIndexForDate(date);
  return MEVITIAI_SETS[idx]!;
}

export function resolvePersona(counts: Record<string, number>): PersonaKey {
  const keys = Object.keys(counts) as PersonaKey[];
  let best: PersonaKey = 'hearty';
  let max = -1;
  for (const k of keys) {
    const c = counts[k] ?? 0;
    if (c > max) {
      max = c;
      best = k;
    }
  }
  return best;
}
