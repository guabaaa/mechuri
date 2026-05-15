import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  FortuneScreen,
  HomeScreen,
  MbtiResultScreen,
  MbtiScreen,
  DeliveryPickScreen,
  MenuChooseScreen,
  MenuResultScreen,
  LadderScreen,
  NearbyPickScreen,
  RecipeScreen,
  TodayScreen,
} from '../screens';
import type { HomeStackParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TodayPick" component={TodayScreen} />
      <Stack.Screen name="MenuChoose" component={MenuChooseScreen} />
      <Stack.Screen name="DeliveryPick" component={DeliveryPickScreen} />
      <Stack.Screen name="MenuResult" component={MenuResultScreen} />
      <Stack.Screen name="MbtiTest" component={MbtiScreen} />
      <Stack.Screen name="MbtiResult" component={MbtiResultScreen} />
      <Stack.Screen name="Ladder" component={LadderScreen} />
      <Stack.Screen name="Fortune" component={FortuneScreen} />
      <Stack.Screen name="NearbyPick" component={NearbyPickScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
    </Stack.Navigator>
  );
}
