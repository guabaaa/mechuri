export type Situation = {
  id: string;
  title: string;
  hint: string;
  menus: readonly string[];
  message: string;
};

export const SITUATIONS: Situation[] = [
  {
    id: 'sick',
    title: '속이 안 좋을 때',
    hint: '부담 적은 메뉴',
    message: '속을 편하게 해주는 쪽으로 골랐어요.',
    menus: ['죽', '순두부찌개', '쌀국수'],
  },
  {
    id: 'stress',
    title: '스트레스 받은 날',
    hint: '확실한 자극',
    message: '오늘은 스트레스 지수가 높아 보여요.',
    menus: ['매운 닭갈비', '마라탕', '제육볶음'],
  },
  {
    id: 'payday',
    title: '월급날',
    hint: '조금 쏠쏠하게',
    message: '가끔은 나를 위한 한 끼도 필요해요.',
    menus: ['스테이크', '회', '브런치 세트'],
  },
  {
    id: 'monday',
    title: '월요일 점심',
    hint: '버티기용 든든함',
    message: '한 주의 시작, 든든하게 가요.',
    menus: ['김치찌개', '돼지국밥', '비빔밥'],
  },
  {
    id: 'nightwork',
    title: '야근 전 식사',
    hint: '빠르게 포만',
    message: '시간이 촉박할 수 있어요. 빠르게 먹기 좋은 메뉴예요.',
    menus: ['분식 세트', '돈까스', '편의점 도시락'],
  },
  {
    id: 'diet',
    title: '다이어트 중',
    hint: '가볍게 단백질',
    message: '부담 덜한 조합으로 골랐어요.',
    menus: ['샐러드', '닭가슴살 샐러드', '쌈밥'],
  },
  {
    id: 'hangover',
    title: '해장 필요',
    hint: '국물이 답',
    message: '뜨끈한 국물로 정리해요.',
    menus: ['순대국밥', '설렁탕', '콩나물국밥'],
  },
  {
    id: 'afterMeeting',
    title: '회의 끝난 날',
    hint: '보상 한 끼',
    message: '수고했어요. 기분 좋은 메뉴 어때요?',
    menus: ['초밥', '파스타', '치킨'],
  },
  {
    id: 'solo',
    title: '혼밥할 때',
    hint: '혼자 먹기 편한',
    message: '혼자도 편하게 즐길 수 있는 메뉴예요.',
    menus: ['라멘', '짜장면', '계란덮밥'],
  },
  {
    id: 'team',
    title: '팀 점심할 때',
    hint: '취향 나누기 좋은',
    message: '여러 명이 나눠 먹기 좋아요.',
    menus: ['닭갈비', '삼겹살', '마라탕'],
  },
  {
    id: 'boss',
    title: '사장님이 쏘는 날',
    hint: '맛있게 실컷',
    message: '좋은 날이에요. 든든하게 즐겨요.',
    menus: ['스테이크', '회', '삼겹살'],
  },
];
