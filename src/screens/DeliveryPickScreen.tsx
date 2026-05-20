import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchDeliveryMenu } from '../api/menusApi';
import type { DeliveryCategory } from '../api/types';
import { baedalPageLogo } from '../assets';
import {
  FeatureActionButton,
  MenuRevealOverlay,
  ScreenContainer,
} from '../components';
import { useMenuReveal } from '../hooks/useMenuReveal';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'DeliveryPick'>;

export default function DeliveryPickScreen({ navigation }: Props) {
  const { phase, error, run, finishReveal, isBusy } = useMenuReveal();
  const [category, setCategory] = useState<DeliveryCategory | null>(null);

  const pickDelivery = async (nextCategory: DeliveryCategory) => {
    setCategory(nextCategory);
    await run(async () => {
      const { menu, message } = await fetchDeliveryMenu(undefined, nextCategory);
      return { menu, message, deliveryCategory: nextCategory };
    });
  };

  const onRevealDone = () => {
    finishReveal(({ menu, message, deliveryCategory }) => {
      navigation.replace('MenuResult', {
        menu,
        message,
        source: 'delivery',
        deliveryCategory: deliveryCategory ?? category ?? 'meal',
      });
    });
  };

  const revealTitle =
    category === 'dessert'
      ? '디저트·카페 고르는 중...'
      : category === 'meal'
        ? '식사 브랜드 고르는 중...'
        : '배달 메뉴 고르는 중...';

  return (
    <View style={styles.root}>
      <ScreenContainer resetScrollOnFocus>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>

        <View style={styles.hero}>
          <Image
            source={baedalPageLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="배달 뽑기"
          />
          <Text style={styles.sub}>
            식사와 디저트·카페 중{'\n'}먼저 골라 주세요.
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          상호명은 참고용이며, 메추리와 각 브랜드는 제휴 관계가 아니에요.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <FeatureActionButton
            label="식사류 뽑기"
            icon="🍗"
            tint={homeTileTints.menu}
            loading={phase === 'loading' && category === 'meal'}
            disabled={isBusy}
            onPress={() => pickDelivery('meal')}
          />
          <FeatureActionButton
            label="디저트·카페 뽑기"
            icon="🧋"
            tint={homeTileTints.delivery}
            loading={phase === 'loading' && category === 'dessert'}
            disabled={isBusy}
            onPress={() => pickDelivery('dessert')}
          />
        </View>
      </ScreenContainer>

      {phase === 'reveal' ? (
        <MenuRevealOverlay onComplete={onRevealDone} title={revealTitle} />
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
    marginBottom: 12,
  },
  logo: {
    width: 280,
    height: 184,
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
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
  actions: {
    gap: 14,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
});
