import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  iconImage?: ImageSourcePropType;
  icon?: string;
  tint?: string;
  loading?: boolean;
  disabled?: boolean;
};

export default function FeatureActionButton({
  label,
  onPress,
  iconImage,
  icon,
  tint = homeTileTints.menu,
  loading = false,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.outer,
        (pressed || loading) && styles.outerPressed,
        disabled && styles.disabled,
      ]}>
      <View style={[styles.btn, { backgroundColor: tint }]}>
        <View style={styles.shine} pointerEvents="none" />
        {loading ? (
          <ActivityIndicator color={colors.tileText} style={styles.loader} />
        ) : (
          <View
            style={[
              styles.iconBox,
              iconImage ? styles.iconBoxSquare : styles.iconBoxRound,
            ]}>
            {iconImage ? (
              <Image
                source={iconImage}
                style={styles.iconImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.iconEmoji}>{icon}</Text>
            )}
          </View>
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'stretch',
    shadowColor: colors.tileShadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 4,
  },
  outerPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  disabled: { opacity: 0.6 },
  btn: {
    minHeight: 72,
    borderRadius: 26,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  loader: { marginRight: 4 },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 212, 188, 0.9)',
  },
  iconBoxSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  iconBoxRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconImage: {
    width: 42,
    height: 42,
  },
  iconEmoji: { fontSize: 24 },
  label: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 24,
    color: colors.tileText,
    letterSpacing: -0.3,
  },
});
