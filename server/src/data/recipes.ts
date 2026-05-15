export type Recipe = {
  menu: string;
  summary: string;
  prepMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  tip?: string;
};

const RECIPES: Record<string, Recipe> = {
  김치찌개: {
    menu: '김치찌개',
    summary: '잘 익은 김치와 돼지고기로 끓이는 국민 찌개',
    prepMinutes: 25,
    servings: 2,
    ingredients: [
      '신김치 2컵',
      '돼지고기 앞다리 150g',
      '대파 1대',
      '양파 1/4개',
      '다진 마늘 1큰술',
      '고춧가루 1큰술',
      '국간장 1큰술',
      '물 2컵',
    ],
    steps: [
      '냄비에 참기름을 두르고 돼지고기를 볶아요.',
      '김치와 양파를 넣고 3~4분 더 볶아요.',
      '고춧가루·다진 마늘·국간장을 넣고 살짝 볶아요.',
      '물을 붓고 끓인 뒤 중약불에서 15분 끓여요.',
      '대파를 넣고 1분 더 끓이면 완성!',
    ],
    tip: '김치가 너무 시면 설탕 반 티스푼을 넣으면 밸런스가 좋아요.',
  },
  된장찌개: {
    menu: '된장찌개',
    summary: '구수한 된장에 채소를 듬뿍 넣은 집밥 찌개',
    prepMinutes: 20,
    servings: 2,
    ingredients: [
      '된장 2큰술',
      '두부 1/3모',
      '애호박 1/4개',
      '감자 1/2개',
      '양파 1/4개',
      '청양고추 1/2개',
      '멸치 육수 2.5컵',
    ],
    steps: [
      '냄비에 멸치 육수와 된장을 풀어 끓여요.',
      '감자·양파를 넣고 익을 때까지 끓여요.',
      '두부·애호박을 넣고 3분 더 끓여요.',
      '청양고추를 올리고 한 번 더 끓이면 끝!',
    ],
  },
  비빔밥: {
    menu: '비빔밥',
    summary: '나물과 고추장으로 비벼 먹는 한 그릇',
    prepMinutes: 30,
    servings: 1,
    ingredients: [
      '밥 1공기',
      '시금치·콩나물·당근 각 소량',
      '계란 1개',
      '고추장 2큰술',
      '참기름·깨',
    ],
    steps: [
      '나물 재료를 각각 데쳐 참기름·소금으로 무쳐요.',
      '당근은 채 썰어 살짝 볶아요.',
      '계란은 프라이해요.',
      '밥 위에 나물·계란·고추장을 올리고 비벼 먹어요.',
    ],
  },
  삼겹살: {
    menu: '삼겹살',
    summary: '집에서 구워 먹는 소금·상추쌈 삼겹살',
    prepMinutes: 25,
    servings: 2,
    ingredients: [
      '삼겹살 400g',
      '소금·후추',
      '상추·마늘·쌈장',
      '깻잎',
    ],
    steps: [
      '팬을 달군 뒤 삼겹살을 올려 중불에서 굽어요.',
      '기름이 나오면 불기를 조절하며 노릇하게 구워요.',
      '쌈 채소와 함께 드세요.',
    ],
    tip: '얼린 고기는 실온에 20분 두면 더 고르게 익어요.',
  },
  치킨: {
    menu: '치킨',
    summary: '바삭한 튀김옷의 후라이드 치킨',
    prepMinutes: 40,
    servings: 2,
    ingredients: [
      '닭다리·윙 600g',
      '우유 1/2컵',
      '소금·후추',
      '튀김가루 1컵',
      '식용유',
    ],
    steps: [
      '닭에 소금·후추를 문지르고 우유에 30분 재워요.',
      '튀김가루를 묻혀 170°C 기름에 튀겨요.',
      '겉이 노릇하면 건져 기름을 뺀 뒤 한 번 더 튀겨 바삭하게!',
    ],
  },
  냉면: {
    menu: '냉면',
    summary: '시원한 육수에 메밀면을 말아 먹는 여름 별미',
    prepMinutes: 15,
    servings: 1,
    ingredients: [
      '메밀냉면 1인분',
      '냉면 육수 400ml',
      '오이·배·계란',
      '식초·설탕 약간',
    ],
    steps: [
      '면을 삶아 찬물에 헹궈요.',
      '육수는 차갑게 준비해요.',
      '면을 그릇에 담고 육수를 붓고 고명을 올려요.',
    ],
  },
  마라탕: {
    menu: '마라탕',
    summary: '얼얼한 마라 소스에 재료를 넣어 끓이는 탕',
    prepMinutes: 30,
    servings: 2,
    ingredients: [
      '마라 소스 3큰술',
      '청경채·버섯·두부·어묵',
      '당면 1줌',
      '마라 육수 또는 물 3컵',
      '화자오·고추',
    ],
    steps: [
      '냄비에 기름과 마라 소스를 볶아 향을 내요.',
      '육수를 붓고 끓인 뒤 재료를 넣어요.',
      '당면은 불 약하게 5분 더 끓여요.',
    ],
    tip: '처음엔 소스를 조금만 넣고 맛보며 조절하세요.',
  },
  짜장면: {
    menu: '짜장면',
    summary: '춘장 볶음 소스를 비벼 먹는 면요리',
    prepMinutes: 25,
    servings: 2,
    ingredients: [
      '생면 2인분',
      '춘장 4큰술',
      '돼지고기 100g',
      '양파·감자·애호박',
      '설탕 1큰술',
      '전분물',
    ],
    steps: [
      '춘장을 기름에 볶아 춘장 향을 빼요.',
      '채소·고기를 넣고 볶아요.',
      '물을 붓고 끓인 뒤 전분물로 농도를 맞춰요.',
      '삶은 면에 소스를 비벼요.',
    ],
  },
  떡볶이: {
    menu: '떡볶이',
    summary: '매콤달콤한 고추장 소스 떡볶이',
    prepMinutes: 20,
    servings: 2,
    ingredients: [
      '떡 300g',
      '어묵 2장',
      '고추장 2큰술',
      '고춧가루 1큰술',
      '설탕 1큰술',
      '멸치 육수 2컵',
    ],
    steps: [
      '육수에 양념을 풀고 끓여요.',
      '떡·어묵을 넣고 중불에서 졸여요.',
      '소스가 걸쭉해지면 완성!',
    ],
  },
  돈까스: {
    menu: '돈까스',
    summary: '바삭한 돼지고기 커틀릿',
    prepMinutes: 35,
    servings: 2,
    ingredients: [
      '돼지등심 2장',
      '밀가루·계란·빵가루',
      '소금·후추',
      '식용유',
    ],
    steps: [
      '고기에 칼집을 내고 소금·후추를 해요.',
      '밀가루 → 계란 → 빵가루 순으로 튀김옷을 입혀요.',
      '170°C 기름에 노릇하게 튀겨요.',
    ],
  },
  카레: {
    menu: '카레',
    summary: '카레가루로 만드는 든든한 일본식 카레',
    prepMinutes: 35,
    servings: 3,
    ingredients: [
      '카레가루 1팩',
      '돼지고기 200g',
      '감자·당근·양파',
      '물 600ml',
    ],
    steps: [
      '채소와 고기를 먹기 좋은 크기로 썰어 볶아요.',
      '물을 붓고 끓인 뒤 카레가루를 넣어 저어요.',
      '중약불에서 걸쭉해질 때까지 10분 끓여요.',
    ],
  },
  파스타: {
    menu: '파스타',
    summary: '올리브오일과 마늘의 알리오 올리오',
    prepMinutes: 20,
    servings: 1,
    ingredients: [
      '스파게티 100g',
      '올리브오일 4큰술',
      '마늘 5쪽',
      '청양고추',
      '파슬리·소금',
    ],
    steps: [
      '면을 소금물에 삶아요.',
      '팬에 올리브오일과 마늘을 약불에 볶아요.',
      '면과 면수를 넣고 섞어 마무리해요.',
    ],
  },
  순두부찌개: {
    menu: '순두부찌개',
    summary: '부드러운 순두부와 계란 찌개',
    prepMinutes: 15,
    servings: 2,
    ingredients: [
      '순두부 1봉',
      '계란 1개',
      '애호박·양파',
      '고춧가루·국간장',
      '멸치 육수 2컵',
    ],
    steps: [
      '냇비에 육수와 양념을 넣고 끓여요.',
      '채소와 순두부를 넣고 끓여요.',
      '계란을 풀고 1분 더 끓이면 완성!',
    ],
  },
  제육볶음: {
    menu: '제육볶음',
    summary: '매콤달콤한 고추장 돼지고기 볶음',
    prepMinutes: 25,
    servings: 2,
    ingredients: [
      '돼지고기 300g',
      '고추장 2큰술',
      '고춧가루 1큰술',
      '양파·대파',
      '다진 마늘·설탕',
    ],
    steps: [
      '고기를 한입 크기로 썰어 양념에 재워요.',
      '팬에 고기를 볶다가 양파를 넣어요.',
      '대파를 넣고 센 불에서 볶아 마무리해요.',
    ],
  },
  라멘: {
    menu: '라멘',
    summary: '진한 돈코츠 스타일 간편 라면',
    prepMinutes: 20,
    servings: 1,
    ingredients: [
      '라면 면 1인분',
      '돈코츠/탕용 스프',
      '차슈·계란·파',
      '물 500ml',
    ],
    steps: [
      '육수를 끓이고 스프를 풀어요.',
      '면을 삶아 그릇에 담아요.',
      '육수를 붓고 토핑을 올려요.',
    ],
  },
  부대찌개: {
    menu: '부대찌개',
    summary: '햄·소시지·라면사리가 들어간 찌개',
    prepMinutes: 25,
    servings: 3,
    ingredients: [
      '스팸·소시지',
      '김치 1컵',
      '라면사리',
      '떡·콩나물',
      '고춧가루·고추장',
      '육수 3컵',
    ],
    steps: [
      '냄비에 김치와 햄류를 볶아요.',
      '육수와 양념을 넣고 끓여요.',
      '콩나물·떡을 넣고 라면사리로 마무리해요.',
    ],
  },
  쌀국수: {
    menu: '쌀국수',
    summary: '맑은 육수의 베트남 쌀국수',
    prepMinutes: 25,
    servings: 1,
    ingredients: [
      '쌀국수 면',
      '사골/닭 육수',
      '소고기 슬라이스',
      '콩나물·바질·라임',
      '피쉬소스',
    ],
    steps: [
      '육수에 피쉬소스로 간을 맞춰 끓여요.',
      '면을 삶아 그릇에 담아요.',
      '육수와 고기·허브를 올려요.',
    ],
  },
};

export function listRecipeMenus(): string[] {
  return Object.keys(RECIPES).sort((a, b) => a.localeCompare(b, 'ko'));
}

export function getRecipe(menu: string): Recipe {
  const key = menu.trim();
  const found = RECIPES[key];
  if (found) {
    return found;
  }
  return buildGenericRecipe(key);
}

function buildGenericRecipe(menu: string): Recipe {
  return {
    menu,
    summary: `${menu}을(를) 집에서 간단히 만들어 보는 기본 레시피예요.`,
    prepMinutes: 25,
    servings: 2,
    ingredients: [
      `${menu}에 어울리는 주재료`,
      '양념(소금·후추·참기름)',
      '대파·마늘',
      '식용유',
    ],
    steps: [
      '재료를 먹기 좋은 크기로 준비해요.',
      '팬이나 냄비에 기름을 두르고 재료를 볶거나 끓여요.',
      '간을 맞추고 5~10분 더 익혀요.',
      '그릇에 담아 따뜻하게 드세요!',
    ],
    tip: '정확한 레시피는 검색해서 참고하면 더 맛있게 만들 수 있어요.',
  };
}

/** 메뉴 풀에 레시피 연결용 — 전체 메뉴 목록 */
export function hasDetailedRecipe(menu: string): boolean {
  return menu.trim() in RECIPES;
}
