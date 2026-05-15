import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, homeTileHeight } from '../theme';
import { fonts } from '../theme/typography';

type Props = {
  icon?: string;
  iconImage?: ImageSourcePropType;
  label: string;
  tint: string;
  onPress: () => void;
};

export default function FeatureTile({
  icon,
  iconImage,
  label,
  tint,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.outer, pressed && styles.outerPressed]}>
      <View style={[styles.tile, { backgroundColor: tint }]}>
        <View style={styles.shine} pointerEvents="none" />
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
        <Text
          style={styles.label}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.82}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    height: homeTileHeight,
    shadowColor: colors.tileShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 3,
  },
  outerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  tile: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  shine: {
    position: 'absolute',
    top: 8,
    left: 10,
    right: 10,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(229, 212, 188, 0.9)',
    overflow: 'hidden',
  },
  iconBoxRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconBoxSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  iconImage: {
    width: 42,
    height: 42,
  },
  iconEmoji: { fontSize: 22 },
  label: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 19,
    color: colors.tileText,
    letterSpacing: -0.3,
  },
});
