import { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  mealRecordImageUri,
  type MealMood,
  type MealRecord,
} from '../storage/mealRecords';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import { parseDateKey } from '../utils/date';

const MOOD_LABEL: Record<MealMood, string> = {
  great: '최고',
  good: '만족',
  ok: '그럭저럭',
};

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

type Props = {
  visible: boolean;
  records: MealRecord[];
  initialIndex?: number;
  onClose: () => void;
};

function formatStoryDate(dateKey: string) {
  const d = parseDateKey(dateKey);
  if (!d) {
    return dateKey;
  }
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]})`;
}

export default function MealStoryViewer({
  visible,
  records,
  initialIndex = 0,
  onClose,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');
  const items = useMemo(
    () => records.filter((r) => Boolean(mealRecordImageUri(r))),
    [records],
  );
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible) {
      setIndex(Math.min(initialIndex, Math.max(items.length - 1, 0)));
    }
  }, [visible, initialIndex, items.length]);

  if (items.length === 0) {
    return null;
  }

  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const goNext = () => {
    if (index < items.length - 1) {
      setIndex(index + 1);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const next = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(next);
          }}
          contentOffset={{ x: index * width, y: 0 }}>
          {items.map((item) => (
            <View key={item.id} style={{ width, height }}>
              <Image
                source={{ uri: mealRecordImageUri(item) }}
                style={styles.photo}
                resizeMode="cover"
                accessibilityLabel={item.menu}
              />
              <View style={[styles.captionWrap, { paddingBottom: insets.bottom + 20 }]}>
                <Text style={styles.captionDate}>{formatStoryDate(item.date)}</Text>
                <Text style={styles.captionMenu}>{item.menu}</Text>
                <Text style={styles.captionMood}>
                  {MOOD_LABEL[item.mood]}
                  {item.memo ? ` · ${item.memo}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={[styles.closeBtn, { top: insets.top + 8 }]}
          hitSlop={12}
          accessibilityLabel="닫기">
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <Pressable style={styles.tapLeft} onPress={goPrev} />
        <Pressable style={styles.tapRight} onPress={goNext} />

        <View style={[styles.progressRow, { top: insets.top + 12 }]}>
          {items.map((item, i) => (
            <View
              key={item.id}
              style={[styles.progressDot, i === index && styles.progressDotActive]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  photo: {
    ...StyleSheet.absoluteFill,
  },
  captionWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 48,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  captionDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
  },
  captionMenu: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.white,
    marginBottom: 6,
  },
  captionMood: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.white,
  },
  tapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    zIndex: 5,
  },
  tapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '35%',
    zIndex: 5,
  },
  progressRow: {
    position: 'absolute',
    left: 16,
    right: 56,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  progressDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  progressDotActive: {
    backgroundColor: colors.white,
  },
});
