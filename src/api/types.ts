export type ApiErrorBody = {
  error: { code: string; message: string };
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
  menus: {
    name: string;
    emoji: string;
    description: string;
    isPick: boolean;
  }[];
  topPick: string;
};

export type MenuPickResult = {
  menu: string;
  message: string;
  kind?: 'brand' | 'menu';
};

export type AuthProviderId = 'kakao' | 'naver' | 'apple' | 'google' | 'guest';

export type AuthUser = {
  id: string;
  provider: AuthProviderId;
  nickname: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type SituationSummary = {
  id: string;
  title: string;
  hint: string;
};

export type SituationPickResult = MenuPickResult & {
  situationId: string;
  situationTitle: string;
};

export type MenuPoolResult = {
  menus: string[];
  roulettePool: string[];
  deliveryPool: string[];
};

export type MbtiQuestion = {
  id: string;
  title: string;
  options: { id: string; label: string; persona: string }[];
};

export type MbtiQuestionsResponse = {
  setId: string;
  setTitle: string;
  setDescription: string;
  weekLabel: string;
  weekNumber: number;
  questions: MbtiQuestion[];
};

export type MbtiResult = {
  personaKey: string;
  title: string;
  body: string;
  menus: string[];
};

export type PersonaKey =
  | 'hearty'
  | 'quick'
  | 'adventure'
  | 'light'
  | 'spicy'
  | 'sweet';

export type NearbyDistrict = {
  id: string;
  label: string;
};

export type NearbyMood = 'solo' | 'team' | 'light' | 'hearty';

export type NearbyPlace = {
  name: string;
  category: string;
  walkMin: number;
};

export type RecipeSummary = {
  menu: string;
  summary: string;
  prepMinutes: number;
  hasDetail: boolean;
};

export type Recipe = {
  menu: string;
  summary: string;
  prepMinutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  tip?: string;
};

export type NearbyPickResult = {
  menu: string;
  message: string;
  areaLabel: string;
  districtId: string;
  districtLabel: string;
  radiusWalkMin: number;
  places: NearbyPlace[];
};
