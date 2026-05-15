import { Image, StyleSheet, View } from 'react-native';
import { mechuriCharacter } from '../assets';

type Props = {
  size?: 'sm' | 'md' | 'lg';
};

const SIZES = {
  sm: { width: 100, height: 106 },
  md: { width: 160, height: 170 },
  lg: { width: 220, height: 233 },
};

export default function QuailMascot({ size = 'md' }: Props) {
  const box = SIZES[size];

  return (
    <View style={[styles.wrap, box]}>
      <Image
        source={mechuriCharacter}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="메추리 캐릭터"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
