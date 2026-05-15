export type LuckyColor = {
  name: string;
  menus: string[];
  avoidHint: string;
};

export const LUCKY_COLORS: LuckyColor[] = [
  {
    name: '빨강',
    menus: ['떡볶이', '김치찌개', '마라탕'],
    avoidHint: '너무 자극적인 건 속이 부담스러울 수 있어요.',
  },
  {
    name: '노랑',
    menus: ['카레', '돈까스', '계란덮밥'],
    avoidHint: '기름진 튀김은 한 번에 많이는 피해도 좋아요.',
  },
  {
    name: '초록',
    menus: ['샐러드', '비빔밥', '쌈밥'],
    avoidHint: '너무 가벼우면 오후에 배고플 수 있어요.',
  },
  {
    name: '갈색',
    menus: ['돈까스', '불고기', '짜장면'],
    avoidHint: '단 음식과 겹치면 당이 확 올라갈 수 있어요.',
  },
  {
    name: '하양',
    menus: ['설렁탕', '칼국수', '순두부찌개'],
    avoidHint: '너무 매운 안주는 피하는 게 좋대요.',
  },
];

export function rollFortune() {
  const score = 60 + Math.floor(Math.random() * 40);
  const color = LUCKY_COLORS[Math.floor(Math.random() * LUCKY_COLORS.length)]!;
  const luckyMenu = color.menus[Math.floor(Math.random() * color.menus.length)]!;
  return { score, color, luckyMenu };
}
