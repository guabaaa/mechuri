import { Image, StyleSheet, Text, View } from 'react-native';
import { mainLogo } from '../assets';
import { colors } from '../theme';
import { fonts } from '../theme/typography';

/** 뽑기 결과 화면 상단 — 글자 로고 + 메추리의 한 마디 */
export default function MechuriPickHeader() {
  return (
    <View style={styles.wrap}>
      <Image
        source={mainLogo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="메추리"
      />
      <Text style={styles.badge}>✨ 메추리의 한 마디</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 160,
    height: 104,
  },
  badge: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 8,
  },
});
