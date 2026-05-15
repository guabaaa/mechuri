import type { NavigatorScreenParams } from '@react-navigation/native';
import type { MbtiResult } from '../api/types';

export type HomeStackParamList = {
  Home: undefined;
  TodayPick: undefined;
  MenuChoose: undefined;
  DeliveryPick: undefined;
  MenuResult: {
    menu: string;
    message: string;
    score?: number;
    source: 'today' | 'situation' | 'delivery' | 'fortune';
    situationId?: string;
    situationTitle?: string;
  };
  MbtiTest: undefined;
  MbtiResult: { result: MbtiResult };
  Ladder: undefined;
  Fortune: undefined;
  NearbyPick: undefined;
  Recipe: { menu: string };
};

export type RecipeStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { menu: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  Nearby: undefined;
  RecipeTab: NavigatorScreenParams<RecipeStackParamList>;
  Profile: undefined;
};
