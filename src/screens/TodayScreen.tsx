import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchTodayMenu } from '../api/menusApi';
import { deliveryIcon, diceIcon, todayMenuLogo } from '../assets';
import {
  FeatureActionButton,
  MenuRevealOverlay,
  ScreenContainer,
} from '../components';
import { useMenuReveal } from '../hooks/useMenuReveal';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'TodayPick'>;

export default function TodayScreen({ navigation }: Props) {
  const { phase, error, run, finishReveal, isBusy } = useMenuReveal();

  const pickRandom = async () => {
    await run(async () => {
      const { menu, message } = await fetchTodayMenu();
      return { menu, message };
    });
  };

  const onRevealDone = () => {
    finishReveal(({ menu, message }) => {
      navigation.replace('MenuResult', {
        menu,
        message,
        source: 'today',
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
          <Image
            source={todayMenuLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="오늘 메뉴 뽑기"
          />
          <Text style={styles.sub}>어떻게 골라볼까요?</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <FeatureActionButton
            label="무작정 뽑기"
            iconImage={diceIcon}
            tint={homeTileTints.menu}
            loading={phase === 'loading'}
            disabled={isBusy}
            onPress={pickRandom}
          />
          <FeatureActionButton
            label="골라서 뽑기"
            icon="🎯"
            tint={homeTileTints.mbti}
            disabled={isBusy}
            onPress={() => navigation.navigate('MenuChoose')}
          />
          <FeatureActionButton
            label="배달 메뉴 뽑기"
            iconImage={deliveryIcon}
            tint={homeTileTints.delivery}
            disabled={isBusy}
            onPress={() => navigation.navigate('DeliveryPick')}
          />
        </View>

        <Text style={styles.hint}>
          무작정·골라서·배달 중 골라서 메추리에게 맡겨보세요
        </Text>
      </ScreenContainer>

      {phase === 'reveal' ? (
        <MenuRevealOverlay onComplete={onRevealDone} />
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
    marginBottom: 20,
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
    lineHeight: 21,
  },
  actions: { gap: 14, marginTop: 4, marginBottom: 8 },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
});
