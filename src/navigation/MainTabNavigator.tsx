import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import {
  FortuneScreen,
  MbtiScreen,
  ProfileScreen,
  RouletteScreen,
  SituationScreen,
  TodayScreen,
} from '../screens';

export type MainTabParamList = {
  Today: undefined;
  Mbti: undefined;
  Fortune: undefined;
  Roulette: undefined;
  Situation: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_LABEL: Record<keyof MainTabParamList, string> = {
  Today: '오늘',
  Mbti: '테스트',
  Fortune: '운세',
  Roulette: '룰렛',
  Situation: '상황',
  Profile: '내정보',
};

function ProfileTabIcon() {
  return <Text style={styles.profileIcon}>👤</Text>;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{ tabBarLabel: TAB_LABEL.Today }}
      />
      <Tab.Screen
        name="Mbti"
        component={MbtiScreen}
        options={{ tabBarLabel: TAB_LABEL.Mbti }}
      />
      <Tab.Screen
        name="Fortune"
        component={FortuneScreen}
        options={{ tabBarLabel: TAB_LABEL.Fortune }}
      />
      <Tab.Screen
        name="Roulette"
        component={RouletteScreen}
        options={{ tabBarLabel: TAB_LABEL.Roulette }}
      />
      <Tab.Screen
        name="Situation"
        component={SituationScreen}
        options={{ tabBarLabel: TAB_LABEL.Situation }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: TAB_LABEL.Profile,
          tabBarIcon: ProfileTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  profileIcon: { fontSize: 16 },
});
