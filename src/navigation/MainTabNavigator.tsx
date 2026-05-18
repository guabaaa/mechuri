import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { homeIcon, mypageIcon, nearbyIcon, recipeIcon } from '../assets';
import { NearbyPickScreen, ProfileScreen } from '../screens';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import type { MainTabParamList } from './types';
import HomeStackNavigator from './HomeStackNavigator';
import RecipeStackNavigator from './RecipeStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabImageIcon({
  source,
  label,
  focused,
}: {
  source: number;
  label: string;
  focused: boolean;
}) {
  return (
    <Image
      source={source}
      style={[styles.tabImage, !focused && styles.tabImageInactive]}
      resizeMode="contain"
      accessibilityLabel={label}
    />
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brown,
        tabBarInactiveTintColor: colors.taupe,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => (
            <TabImageIcon source={homeIcon} label="홈" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={NearbyPickScreen}
        options={{
          tabBarLabel: '근처',
          tabBarIcon: ({ focused }) => (
            <TabImageIcon source={nearbyIcon} label="근처" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="RecipeTab"
        component={RecipeStackNavigator}
        options={{
          tabBarLabel: '레시피',
          tabBarIcon: ({ focused }) => (
            <TabImageIcon source={recipeIcon} label="레시피" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <TabImageIcon source={mypageIcon} label="마이페이지" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 2,
    borderTopColor: colors.brown,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
  },
  tabImage: { width: 26, height: 26 },
  tabImageInactive: { opacity: 0.55 },
});
