import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { mechuriAdult, mechuriChick } from '../assets';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';

type Variant = 'hatch' | 'evolve';

type Props = {
  visible: boolean;
  variant: Variant;
  onClose: () => void;
};

export default function MechuriHatchModal({ visible, variant, onClose }: Props) {
  const eggScale = useRef(new Animated.Value(1)).current;
  const eggOpacity = useRef(new Animated.Value(1)).current;
  const birdScale = useRef(new Animated.Value(0.3)).current;
  const birdOpacity = useRef(new Animated.Value(0)).current;
  const crackOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      eggScale.setValue(1);
      eggOpacity.setValue(1);
      birdScale.setValue(0.3);
      birdOpacity.setValue(0);
      crackOpacity.setValue(0);
      return;
    }

    const shake = Animated.sequence([
      Animated.timing(eggScale, {
        toValue: 1.08,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(eggScale, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(eggScale, {
        toValue: 1.06,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eggScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    Animated.sequence([
      shake,
      Animated.timing(crackOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(eggOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(birdOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.spring(birdScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    visible,
    birdOpacity,
    birdScale,
    crackOpacity,
    eggOpacity,
    eggScale,
  ]);

  const title =
    variant === 'hatch' ? '알에서 깨어났어요!' : '메추리가 다 컸어요!';
  const body =
    variant === 'hatch'
      ? '첫 출석체크 완료!\n앞으로 매일 와서 키워 주세요.'
      : '7번째 출석 달성!\n이제 든든한 점심 파트너 메추리예요.';

  const birdSource = variant === 'hatch' ? mechuriChick : mechuriAdult;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.kicker}>🐣 메추리 성장</Text>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.stageArea}>
            <Animated.View
              style={[
                styles.eggWrap,
                {
                  opacity: eggOpacity,
                  transform: [{ scale: eggScale }],
                },
              ]}>
              <View style={styles.egg}>
                <Text style={styles.eggEmoji}>🥚</Text>
              </View>
              <Animated.Text style={[styles.crack, { opacity: crackOpacity }]}>
                ✨
              </Animated.Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.birdWrap,
                {
                  opacity: birdOpacity,
                  transform: [{ scale: birdScale }],
                },
              ]}>
              <Image
                source={birdSource}
                style={styles.bird}
                resizeMode="contain"
                accessibilityLabel="메추리"
              />
            </Animated.View>
          </View>

          <Text style={styles.body}>{body}</Text>

          <Pressable onPress={onClose} style={styles.btn}>
            <Text style={styles.btnText}>확인</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(58, 42, 26, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 22,
    alignItems: 'center',
  },
  kicker: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.orange,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    textAlign: 'center',
    marginBottom: 16,
  },
  stageArea: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  eggWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  egg: {
    width: 120,
    height: 140,
    borderRadius: 60,
    backgroundColor: homeTileTints.mbti,
    borderWidth: 3,
    borderColor: colors.tileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggEmoji: { fontSize: 56 },
  crack: {
    position: 'absolute',
    fontSize: 36,
    bottom: 24,
  },
  birdWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bird: {
    width: 180,
    height: 180,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.taupe,
    textAlign: 'center',
    marginBottom: 18,
  },
  btn: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 160,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
  },
});
