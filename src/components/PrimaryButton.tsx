import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'tile';
  icon?: string;
  iconImage?: ImageSourcePropType;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconImage,
}: Props) {
  const isTile = variant === 'tile';
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        isTile && styles.tile,
        isPrimary && styles.primary,
        variant === 'outline' && styles.outline,
        pressed && styles.pressed,
      ]}>
      {iconImage ? (
        <Image source={iconImage} style={styles.iconImage} resizeMode="contain" />
      ) : icon ? (
        <Text style={styles.icon}>{icon}</Text>
      ) : null}
      <Text
        style={[
          styles.label,
          isPrimary && styles.labelPrimary,
          variant === 'outline' && styles.labelOutline,
          isTile && styles.labelTile,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 26,
    alignSelf: 'stretch',
    shadowColor: colors.tileShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 3,
  },
  tile: {
    backgroundColor: homeTileTints.menu,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  primary: {
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  icon: { fontSize: 20 },
  iconImage: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 17,
    letterSpacing: -0.2,
  },
  labelPrimary: { color: colors.white },
  labelOutline: { color: colors.tileText },
  labelTile: { color: colors.tileText },
});
