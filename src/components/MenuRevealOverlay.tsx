import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import RevealVideo from './RevealVideo';

type Props = {
  onComplete: () => void;
  title?: string;
  subtitle?: string;
};

export default function MenuRevealOverlay({
  onComplete,
  title = '메추리가 고르는 중...',
  subtitle = '잠시만 기다려 주세요',
}: Props) {
  return (
    <View style={styles.overlay}>
      <RevealVideo onComplete={onComplete} />
      <View style={styles.caption} pointerEvents="none">
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.cream,
    zIndex: 10,
  },
  caption: {
    position: 'absolute',
    bottom: 72,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    textShadowColor: 'rgba(255, 249, 236, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
    textShadowColor: 'rgba(255, 249, 236, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
