import { useState } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { mechuriCharacter } from '../assets';
import { colors } from '../theme';
import MechuriVideoFrame from './MechuriVideoFrame';

export default function SplashScreen() {
  const { width } = useWindowDimensions();
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return (
      <View style={styles.fallback}>
        <Image
          source={mechuriCharacter}
          style={{ width: width * 0.55, height: width * 0.55 }}
          resizeMode="contain"
          accessibilityLabel="메추리"
        />
      </View>
    );
  }

  return (
    <MechuriVideoFrame repeat onError={() => setVideoFailed(true)} />
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
});
