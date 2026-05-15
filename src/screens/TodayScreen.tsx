import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fetchTodayMenu } from '../api/menusApi';
import { diceIcon } from '../assets';
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
          <QuailMascot size="md" />
          <Text style={styles.head}>오늘 메뉴 뽑기</Text>
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
            icon="🛵"
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
    paddingVertical: 12,
    marginBottom: 24,
  },
  head: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    marginTop: 12,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 8,
    textAlign: 'center',
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
