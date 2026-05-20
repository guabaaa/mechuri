export type LuckyMenuPick = {
  name: string;
  emoji: string;
  description: string;
  isPick: boolean;
};

export type FortuneResult = {
  dateLabel: string;
  headline: string;
  body: string;
  score: number;
  scoreCaption: string;
  color: {
    name: string;
    hex: string;
    description: string;
  };
  menus: LuckyMenuPick[];
  topPick: string;
};

type LuckyColorDef = {
  name: string;
  hex: string;
  description: string;
  menus: { name: string; emoji: string; description: string }[];
};

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const HEADLINES = [
  '봄의 끝자락, 새 도약의 기운이 찾아온다',
  '차분한 결심이 오후의 행운을 부른다',
  '작은 선택이 큰 만족으로 이어지는 날',
  '따뜻한 한 끼가 마음의 온도를 올려준다',
  '오늘은 맛으로 운을 여는 타이밍',
  '가벼운 용기가 점심 자리를 빛낸다',
];

const SCORE_CAPTIONS = [
  '오늘은 흐름이 좋아요. 작은 용기가 큰 결실로 돌아옵니다!',
  '점심 한 끼만 잘 골라도 오후 컨디션이 달라져요.',
  '주변과 나눠 먹으면 행운 지수가 더 올라갑니다.',
  '오늘은 평소보다 직감을 믿어도 좋은 날이에요.',
];

const LUCKY_COLORS: LuckyColorDef[] = [
  {
    name: '연두빛 새싹',
    hex: '#9AE6B4',
    description: '5월의 생기가 당신의 시작을 응원해요. 새 메뉴에 도전해 보세요.',
    menus: [
      {
        name: '비빔밥',
        emoji: '🍚',
        description: '여러 재료의 조화가 오늘의 도약 에너지를 높여줍니다.',
      },
      {
        name: '된장찌개',
        emoji: '🍲',
        description: '구수한 기운이 마음을 안정시키고 집중력을 올려줍니다.',
      },
      {
        name: '유자차',
        emoji: '🍵',
        description: '상큼한 향이 생일 전 설레는 기운을 깨워줍니다.',
      },
    ],
  },
  {
    name: '황금빛 노을',
    hex: '#F6D365',
    description: '따뜻한 색이 대인운을 살려줘요. 동료와 함께 먹기 좋은 날입니다.',
    menus: [
      {
        name: '카레',
        emoji: '🍛',
        description: '든든한 한 그릇이 오후 업무 리듬을 지켜줍니다.',
      },
      {
        name: '돈까스',
        emoji: '🍱',
        description: '바삭한 식감이 기분 전환에 딱 맞는 선택이에요.',
      },
      {
        name: '미숫가루',
        emoji: '🥛',
        description: '고소함이 몸을 편안하게 만들어 줍니다.',
      },
    ],
  },
  {
    name: '보랏빛 별빛',
    hex: '#B794F6',
    description: '직감이 살아나는 컬러예요. 평소와 다른 메뉴가 행운이 됩니다.',
    menus: [
      {
        name: '파스타',
        emoji: '🍝',
        description: '새로운 맛이 창의력을 자극하고 대화를 이어줍니다.',
      },
      {
        name: '마라탕',
        emoji: '🌶️',
        description: '적당한 자극이 잠든 에너지를 깨워줍니다.',
      },
      {
        name: '라떼',
        emoji: '☕',
        description: '부드러운 카페인이 오후 집중을 도와줍니다.',
      },
    ],
  },
  {
    name: '산호빛 여명',
    hex: '#FC8181',
    description: '활력이 필요한 날. 색다른 메뉴로 기분을 환기해 보세요.',
    menus: [
      {
        name: '김치찌개',
        emoji: '🥘',
        description: '얼큼함이 결단력을 북돋아 주는 메뉴입니다.',
      },
      {
        name: '떡볶이',
        emoji: '🌶️',
        description: '매콤달콤함이 지루한 오후를 깨워줍니다.',
      },
      {
        name: '과일주스',
        emoji: '🧃',
        description: '비타민이 가볍게 컨디션을 회복시켜 줍니다.',
      },
    ],
  },
];

const MONTH_BODY: Record<number, string> = {
  1: '새해의 기운이 아직 남아 있어요. 천천히 씹는 한 끼가 하루를 단단하게 만듭니다.',
  2: '차분히 준비하면 뜻밖의 기회가 찾아올 수 있어요. 너무 급한 선택은 피해보세요.',
  3: '변화의 바람이 불어요. 평소 가지 않던 식당이 행운의 장소가 될 수 있습니다.',
  4: '성장의 계절, 에너지가 올라가는 시기예요. 업무에서 작은 돌파구가 생길 수 있습니다.',
  5: '5월의 생기가 당신을 응원해요. 가벼운 산책 후 점심이 특히 좋습니다.',
  6: '생일이 가까운 달이라 기운이 상승 중이에요. 새로운 시도에 유리한 흐름입니다.',
  7: '열기와 함께 활력도 커지는 시기. 수분 보충과 함께 든든한 메뉴를 추천해요.',
  8: '휴가철 에너지가 섞여 있어요. 여유 있는 점심이 오후 컨디션을 지켜줍니다.',
  9: '정리와 결실의 시기. 균형 잡힌 한 끼가 집중력을 높여줍니다.',
  10: '선선한 바람과 함께 마음도 차분해져요. 따뜻한 국물이 행운 메뉴입니다.',
  11: '한 해를 마무리하며 돌아볼 시간. 익숙한 맛이 안정감을 줍니다.',
  12: '한 해의 피로가 쌓이기 쉬운 달. 든든하고 따뜻한 메뉴가 좋아요.',
};

export function parseBirthday(isoOrDigits: string): Date {
  const digits = isoOrDigits.replace(/\D/g, '');
  if (digits.length !== 8) {
    throw new Error('INVALID_BIRTHDAY');
  }
  const y = Number(digits.slice(0, 4));
  const m = Number(digits.slice(4, 6));
  const d = Number(digits.slice(6, 8));
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    throw new Error('INVALID_BIRTHDAY');
  }
  const now = new Date();
  if (date > now || y < 1920) {
    throw new Error('INVALID_BIRTHDAY');
  }
  return date;
}

export function formatTodayLabel(today: Date = new Date()): string {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const day = today.getDate();
  const w = WEEKDAYS[today.getDay()];
  return `${y}년 ${m}월 ${day}일 ${w}요일`;
}

function hashSeed(...parts: number[]): number {
  let h = 0;
  for (const p of parts) {
    h = (h * 31 + p) | 0;
  }
  return Math.abs(h);
}

function pickIndex(seed: number, length: number, salt: number): number {
  return (hashSeed(seed, salt) + salt) % length;
}

export function buildFortuneFromBirthday(
  birthday: Date,
  today: Date = new Date(),
): FortuneResult {
  const seed =
    birthday.getFullYear() * 10000 +
    (birthday.getMonth() + 1) * 100 +
    birthday.getDate() +
    today.getFullYear() * 1000 +
    (today.getMonth() + 1) * 50 +
    today.getDate();

  const birthMonth = birthday.getMonth() + 1;
  const todayMonth = today.getMonth() + 1;

  const headline = HEADLINES[pickIndex(seed, HEADLINES.length, 1)]!;
  /** 76~97 — 이전(68~95)보다 전반적으로 소폭 상향 */
  const score = 76 + (pickIndex(seed, 33, 2) % 22);
  const scoreCaption = SCORE_CAPTIONS[pickIndex(seed, SCORE_CAPTIONS.length, 3)]!;
  const colorDef = LUCKY_COLORS[pickIndex(seed, LUCKY_COLORS.length, 4)]!;

  const monthNote = MONTH_BODY[birthMonth] ?? MONTH_BODY[6]!;
  const seasonBridge =
    birthMonth === todayMonth
      ? `오늘은 생일 달이라 기운이 특히 맑게 읽혀요. `
      : birthMonth === 6
        ? `6월생이라 에너지가 상승하는 흐름이에요. `
        : '';

  const body = `${seasonBridge}${monthNote} 오늘은 업무에서 작은 돌파구가 생길 수 있고, 연애·건강운은 가벼운 산책과 균형 잡힌 점심이 도움이 됩니다. 행운 점수 ${score}점 — ${colorDef.name} 컬러와 어울리는 메뉴를 골라보세요.`;

  const menuOffset = pickIndex(seed, colorDef.menus.length, 5);
  const menus: LuckyMenuPick[] = colorDef.menus.map((m, i) => ({
    ...m,
    isPick: i === menuOffset,
  }));

  const topPick = menus.find((m) => m.isPick)!.name;

  return {
    dateLabel: formatTodayLabel(today),
    headline,
    body,
    score,
    scoreCaption,
    color: {
      name: colorDef.name,
      hex: colorDef.hex,
      description: colorDef.description,
    },
    menus,
    topPick,
  };
}
