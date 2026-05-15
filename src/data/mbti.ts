export type MbtiQuestion = {
  id: string;
  title: string;
  options: { id: string; label: string; persona: string }[];
};

/** 간단 심리테스트 — 결과는 persona 키로 매핑 */
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  {
    id: 'q1',
    title: '점심시간이 30분밖에 없다. 당신의 선택은?',
    options: [
      { id: 'a', label: '빠르게 먹을 수 있는 국밥', persona: 'hearty' },
      { id: 'b', label: '편의점 도시락', persona: 'quick' },
      { id: 'c', label: '그래도 맛집 웨이팅', persona: 'adventure' },
      { id: 'd', label: '커피랑 빵으로 해결', persona: 'light' },
    ],
  },
  {
    id: 'q2',
    title: '월요일 점심, 지금 기분은?',
    options: [
      { id: 'a', label: '든든하게 먹고 버티기', persona: 'hearty' },
      { id: 'b', label: '가볍게, 졸음 줄이기', persona: 'light' },
      { id: 'c', label: '매운 걸로 홧김', persona: 'spicy' },
      { id: 'd', label: '달달한 디저트 땡김', persona: 'sweet' },
    ],
  },
  {
    id: 'q3',
    title: '팀원이 “뭐 먹지?”라고 한다면?',
    options: [
      { id: 'a', label: '내가 룰렛 돌려볼게', persona: 'adventure' },
      { id: 'b', label: '국밥 가실 분', persona: 'hearty' },
      { id: 'c', label: '다이어트 중이라 샐러드', persona: 'light' },
      { id: 'd', label: '오늘은 배달 각', persona: 'quick' },
    ],
  },
  {
    id: 'q4',
    title: '야근 전 한 끼, 우선순위는?',
    options: [
      { id: 'a', label: '포만감', persona: 'hearty' },
      { id: 'b', label: '속 편한 음식', persona: 'light' },
      { id: 'c', label: '짧은 시간', persona: 'quick' },
      { id: 'd', label: '기분 전환', persona: 'spicy' },
    ],
  },
];

export type PersonaKey =
  | 'hearty'
  | 'quick'
  | 'adventure'
  | 'light'
  | 'spicy'
  | 'sweet';

export const PERSONA_RESULTS: Record<
  PersonaKey,
  { title: string; body: string; menus: string[] }
> = {
  hearty: {
    title: '든든한 국밥형 인간',
    body:
      '배고픔을 참지 못하고, 메뉴 선택에서 실패를 싫어하는 타입이에요. 오늘도 힘내요.',
    menus: ['돼지국밥', '순대국', '설렁탕'],
  },
  quick: {
    title: '효율 편의점형',
    body: '시간 대비 만족을 중시해요. 바쁜 자영업자·직장인에게 찰떡이에요.',
    menus: ['편의점 도시락', '삼각김밥', '컵누들'],
  },
  adventure: {
    title: '맛집 탐험가',
    body: '웨이팅도 즐길 수 있는 음식 모험가예요. 새로운 메뉴를 두려워하지 않아요.',
    menus: ['마라탕', '회', '브런치 세트'],
  },
  light: {
    title: '밸런스 가벼운 한 끼형',
    body: '속 부담을 줄이고 다음 일정을 챙기는 스타일이에요.',
    menus: ['샐러드', '비빔밥', '순두부찌개'],
  },
  spicy: {
    title: '스트레스 불태우는 매운맛형',
    body: '자극적인 맛으로 화를 식히는 편이에요. 오늘도 한 방 제대로예요.',
    menus: ['매운 닭갈비', '마라탕', '제육볶음'],
  },
  sweet: {
    title: '당 충전 달달형',
    body: '기분 전환엔 달콤함이죠. 가끔은 디저트가 정답이에요.',
    menus: ['팥빙수', '크로와상', '카페 브런치'],
  },
};

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
