import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  fetchDeliveryMenu,
  fetchSituationMenu,
  fetchTodayMenu,
} from '../api/menusApi';
import { diceIcon, riceIcon } from '../assets';
import {
  FeatureActionButton,
  MechuriPickHeader,
  MenuRevealOverlay,
  ScreenContainer,
} from '../components';
import { useMenuReveal } from '../hooks/useMenuReveal';
import type { HomeStackParamList } from '../navigation/types';
import { colors, homeTileTints } from '../theme';
import { fonts } from '../theme/typography';
import { menuEmoji } from '../utils/menuEmoji';

type Props = NativeStackScreenProps<HomeStackParamList, 'MenuResult'>;

function ribbonLabel(
  source: Props['route']['params']['source'],
  situationTitle?: string,
  deliveryCategory?: Props['route']['params']['deliveryCategory'],
) {
  if (source === 'situation' && situationTitle) {
    return situationTitle;
  }
  if (source === 'situation') {
    return '상황 맞춤 메뉴';
  }
  if (source === 'delivery') {
    return deliveryCategory === 'dessert'
      ? '배달 디저트·카페'
      : '배달 식사 브랜드';
  }
  return '오늘의 추천 메뉴';
}

export default function MenuResultScreen({ navigation, route }: Props) {
  const params = route.params;
  const { source, score, situationId, deliveryCategory } = params;
  const { phase, error, run, finishReveal, isBusy } = useMenuReveal();

  const [menu, setMenu] = useState(params.menu);
  const [message, setMessage] = useState(params.message);
  const [situationTitle, setSituationTitle] = useState(params.situationTitle);

  const usePickStyle =
    source === 'today' || source === 'situation' || source === 'delivery';
  const label = ribbonLabel(source, situationTitle, deliveryCategory);

  const applyResult = useCallback(
    (next: {
      menu: string;
      message: string;
      situationTitle?: string;
      deliveryCategory?: typeof deliveryCategory;
    }) => {
      setMenu(next.menu);
      setMessage(next.message);
      if (next.situationTitle) {
        setSituationTitle(next.situationTitle);
      }
      navigation.setParams({
        ...params,
        menu: next.menu,
        message: next.message,
        situationTitle: next.situationTitle ?? params.situationTitle,
        deliveryCategory: next.deliveryCategory ?? params.deliveryCategory,
      });
    },
    [navigation, params],
  );

  const redraw = useCallback(async () => {
    await run(async () => {
      if (source === 'today') {
        const result = await fetchTodayMenu(menu);
        return result;
      }
      if (source === 'situation') {
        const id = situationId ?? params.situationId;
        if (!id) {
          throw new Error('상황 정보가 없어요. 처음부터 다시 골라 주세요.');
        }
        const result = await fetchSituationMenu(id);
        return {
          menu: result.menu,
          message: result.message,
          situationTitle: result.situationTitle,
          situationId: id,
        };
      }
      if (source === 'delivery') {
        const result = await fetchDeliveryMenu(
          menu,
          deliveryCategory ?? params.deliveryCategory ?? 'meal',
        );
        return { ...result, deliveryCategory: result.category ?? deliveryCategory };
      }
      throw new Error('다시 뽑기를 지원하지 않는 결과예요.');
    });
  }, [deliveryCategory, menu, params.deliveryCategory, params.situationId, run, situationId, source]);

  const onRevealDone = () => {
    finishReveal((result) => {
      applyResult(result);
    });
  };

  return (
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen} resetScrollOnFocus>
        <MechuriPickHeader />

        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>{label}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardShine} pointerEvents="none" />
          <Text style={styles.sparkleTop}>🌾</Text>

          <View style={styles.plateRing}>
            <View style={styles.plate}>
              <Text style={styles.emoji}>{menuEmoji(menu)}</Text>
            </View>
          </View>

          <Text style={styles.pickLabel}>오늘 이거 어때요?</Text>
          <Text style={styles.menuName}>{menu}</Text>

          {score != null ? (
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>오늘의 밥운세 점수</Text>
              <Text style={styles.scoreValue}>{score}점</Text>
            </View>
          ) : null}

          <View style={styles.messageBox}>
            <Text style={styles.message}>{message}</Text>
          </View>

          <Text style={styles.sparkleBottom}>🍚 ✨</Text>
        </View>

        {source === 'delivery' ? (
          <Text style={styles.disclaimer}>
            상호명은 참고용이며, 메추리와 각 브랜드는 제휴 관계가 아니에요.
          </Text>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <FeatureActionButton
            label="다시 뽑기"
            tint={
              source === 'delivery'
                ? homeTileTints.delivery
                : usePickStyle
                  ? homeTileTints.menu
                  : homeTileTints.menu
            }
            icon={source === 'delivery' ? '🛵' : usePickStyle ? undefined : '🎲'}
            iconImage={
              source === 'delivery' ? undefined : usePickStyle ? diceIcon : undefined
            }
            loading={phase === 'loading'}
            disabled={isBusy}
            onPress={redraw}
          />

          <FeatureActionButton
            label="오늘 밥친구에 올리기"
            iconImage={riceIcon}
            tint={homeTileTints.meal}
            onPress={() =>
              navigation.navigate('MealRecord', { prefilledMenu: menu })
            }
          />

          {source !== 'delivery' ? (
            <FeatureActionButton
              label="레시피 보기"
              icon="📖"
              tint={homeTileTints.recipe}
              onPress={() => navigation.navigate('Recipe', { menu })}
            />
          ) : null}
        </View>
      </ScreenContainer>

      {phase === 'reveal' ? (
        <MenuRevealOverlay
          onComplete={onRevealDone}
          title="다시 골라볼게요..."
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { paddingTop: 4 },
  ribbon: {
    alignSelf: 'center',
    backgroundColor: colors.yellow,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    marginBottom: 16,
  },
  ribbonText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: colors.tileShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 4,
  },
  cardShine: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 237, 170, 0.45)',
  },
  sparkleTop: {
    fontSize: 18,
    marginBottom: 8,
    opacity: 0.85,
  },
  sparkleBottom: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.75,
  },
  plateRing: {
    padding: 5,
    borderRadius: 80,
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    marginBottom: 14,
  },
  plate: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  emoji: { fontSize: 56 },
  pickLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    marginBottom: 4,
  },
  menuName: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.brown,
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 38,
  },
  scoreBox: {
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 90, 61, 0.08)',
    borderRadius: 14,
  },
  scoreLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
  },
  scoreValue: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.red,
    marginTop: 2,
  },
  messageBox: {
    width: '100%',
    backgroundColor: colors.cream,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.tileBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: colors.tileText,
    textAlign: 'center',
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.red,
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    gap: 14,
    marginTop: 4,
    marginBottom: 12,
  },
});
