import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchDeliveryMenu } from '../api/menusApi';
import {
  FeatureActionButton,
  MenuRevealOverlay,
  QuailMascot,
  ScreenContainer,
} from '../components';
import { useMenuReveal } from '../hooks/useMenuReveal';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeliveryPick'>;

export default function DeliveryPickScreen({ navigation }: Props) {
  const { phase, error, run, finishReveal, isBusy } = useMenuReveal();

  const pickDelivery = async () => {
    await run(async () => {
      const { menu, message } = await fetchDeliveryMenu();
      return { menu, message };
    });
  };

  const onRevealDone = () => {
    finishReveal(({ menu, message }) => {
      navigation.replace('MenuResult', {
        menu,
        message,
        source: 'delivery',
      });
    });
  };

  return (
    <View style={styles.root}>
      <ScreenContainer>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>

        <View style={styles.hero}>
          <QuailMascot size="md" />
          <Text style={styles.head}>배달 메뉴 뽑기</Text>
          <Text style={styles.sub}>
            치킨·피자·카페까지,{'\n'}배달 브랜드를 골라드려요.
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          상호명은 참고용이며, 메추리와 각 브랜드는 제휴 관계가 아니에요.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <FeatureActionButton
          label="배달 브랜드 뽑기"
          icon="🛵"
          tint={homeTileTints.delivery}
          loading={phase === 'loading'}
          disabled={isBusy}
          onPress={pickDelivery}
        />
      </ScreenContainer>

      {phase === 'reveal' ? (
        <MenuRevealOverlay
          onComplete={onRevealDone}
          title="배달 메뉴 고르는 중..."
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 10,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  tag: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.tileText,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
});
