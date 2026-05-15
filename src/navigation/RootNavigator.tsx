import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens';
import MainTabNavigator from './MainTabNavigator';

export default function RootNavigator() {
  const { ready, user } = useAuth();

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <MainTabNavigator />;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf8f5',
  },
});
