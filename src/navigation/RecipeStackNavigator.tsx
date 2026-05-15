import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecipeListScreen from '../screens/RecipeListScreen';
import RecipeScreen from '../screens/RecipeScreen';
import type { RecipeStackParamList } from './types';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RecipeStackParamList>();

export default function RecipeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.cream },
      }}>
      <Stack.Screen name="RecipeList" component={RecipeListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeScreen} />
    </Stack.Navigator>
  );
}
