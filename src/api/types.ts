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

export type DeliveryCategory = 'meal' | 'dessert';

export type MenuPickResult = {
  menu: string;
  message: string;
  kind?: 'brand' | 'menu';
  category?: DeliveryCategory;
};

export type AuthProviderId = 'kakao' | 'naver' | 'apple' | 'google' | 'guest';

export type AuthUser = {
  id: string;
  provider: AuthProviderId;
  nickname: string;
  joinedAt?: string;
  hasConsents: boolean;
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
  subtitle: string;
  emoji: string;
  body: string;
  traits: string[];
  menus: string[];
  mechuriTip: string;
};

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

export type NearbyDistrict = {
  id: string;
  label: string;
};

export type NearbyMood = 'solo' | 'team' | 'light' | 'hearty';

export type NearbyPlace = {
  name: string;
  category: string;
  walkMin: number;
  distanceM?: number;
  lat?: number;
  lng?: number;
  address?: string;
  placeUrl?: string;
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
  userLat?: number;
  userLng?: number;
  places: NearbyPlace[];
};
