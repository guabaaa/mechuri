import { useAuth } from '../context/AuthContext';
import SplashScreen from '../components/SplashScreen';
import { LoginScreen } from '../screens';
import MainTabNavigator from './MainTabNavigator';

export default function RootNavigator() {
  const { ready, user } = useAuth();

  if (!ready) {
    return <SplashScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <MainTabNavigator />;
}
