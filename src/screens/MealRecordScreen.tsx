import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { riceIcon } from '../assets';
import {
  FeatureActionButton,
  MealStoryViewer,
  QuailMascot,
  ScreenContainer,
} from '../components';
import type { HomeStackParamList } from '../navigation/types';
import { openMealPhotoSettings } from '../media/mealPhotoPermissions';
import { useMealPhotoPermissionStatus } from '../media/useMealPhotoPermissionStatus';
import {
  MealPhotoPermissionError,
  pickMealPhotoFromCamera,
  pickMealPhotoFromLibrary,
} from '../media/pickMealPhoto';
import {
  deleteMealRecord,
  getMealRecordForDate,
  loadMealRecords,
  mealRecordImageUri,
  saveMealRecord,
  type MealMood,
  type MealRecord,
} from '../storage/mealRecords';
import {
  deleteMealPhotoFile,
  mealPhotoFilePath,
  persistMealPhotoFromUri,
} from '../storage/mealPhotos';
import { colors, homeTileTints, shadows } from '../theme';
import { fonts } from '../theme/typography';
import { formatTodayLabel, parseDateKey, toDateKey } from '../utils/date';

type Props = NativeStackScreenProps<HomeStackParamList, 'MealRecord'>;

const MOODS: { id: MealMood; label: string; emoji: string }[] = [
  { id: 'great', label: '최고', emoji: '😋' },
  { id: 'good', label: '만족', emoji: '🙂' },
  { id: 'ok', label: '그럭저럭', emoji: '😐' },
];

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatShortDate(dateKey: string) {
  const d = parseDateKey(dateKey);
  if (!d) {
    return dateKey;
  }
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAY_LABELS[d.getDay()]})`;
}

export default function MealRecordScreen({ navigation, route }: Props) {
  const prefilledMenu = route.params?.prefilledMenu;
  const today = useMemo(() => new Date(), []);
  const todayKey = toDateKey(today);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const [records, setRecords] = useState<MealRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<MealRecord | null>(null);
  const [draftPhotoUri, setDraftPhotoUri] = useState<string | null>(null);
  const [menu, setMenu] = useState(prefilledMenu ?? '');
  const [mood, setMood] = useState<MealMood>('good');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permBlocked, setPermBlocked] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  /** 갤러리·카메라 다녀온 뒤 refresh가 초안을 덮어쓰지 않도록 */
  const formDirtyRef = useRef(false);
  const [requestingPerm, setRequestingPerm] = useState(false);
  const {
    showAllowButton,
    showSettings: showPermSettings,
    requestAll: requestMediaPermissions,
    refresh: refreshMediaPermissions,
  } = useMealPhotoPermissionStatus();

  const storyRecords = useMemo(
    () =>
      records
        .filter((r) => mealRecordImageUri(r))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [records],
  );

  const refresh = useCallback(
    async (options?: { syncForm?: boolean }) => {
      const list = await loadMealRecords();
      const todayItem = await getMealRecordForDate(today);
      setRecords(list);
      setTodayRecord(todayItem);

      const shouldSyncForm = options?.syncForm && !formDirtyRef.current;
      if (shouldSyncForm) {
        if (todayItem) {
          setMenu(todayItem.menu);
          setMood(todayItem.mood);
          setMemo(todayItem.memo ?? '');
          setDraftPhotoUri(mealRecordImageUri(todayItem) ?? null);
        } else {
          setDraftPhotoUri(null);
        }
      }
      return todayItem;
    },
    [today],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const todayItem = await refresh({ syncForm: true });
        if (!cancelled && !todayItem && prefilledMenu) {
          setMenu(prefilledMenu);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 최초 진입 시에만 로드
  }, []);

  const recordDates = useMemo(
    () => new Set(records.filter((r) => mealRecordImageUri(r)).map((r) => r.date)),
    [records],
  );

  const recentStories = useMemo(
    () => storyRecords.filter((r) => r.date !== todayKey).slice(0, 12),
    [storyRecords, todayKey],
  );

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: ({ day: number; key: string } | null)[] = [];
    for (let i = 0; i < firstDow; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = toDateKey(new Date(year, month, day));
      cells.push({ day, key });
    }
    return cells;
  }, [viewMonth]);

  const openStoryAt = (record: MealRecord) => {
    const idx = storyRecords.findIndex((r) => r.id === record.id);
    setStoryIndex(idx >= 0 ? idx : 0);
    setStoryOpen(true);
  };

  const onPickPhoto = async (source: 'camera' | 'library') => {
    setPicking(true);
    setError(null);
    setPermBlocked(false);
    try {
      const uri =
        source === 'camera'
          ? await pickMealPhotoFromCamera()
          : await pickMealPhotoFromLibrary();
      if (uri) {
        formDirtyRef.current = true;
        setDraftPhotoUri(uri);
      }
    } catch (e) {
      if (e instanceof MealPhotoPermissionError) {
        setPermBlocked(e.blocked);
        setError(e.message);
      } else {
        setError(e instanceof Error ? e.message : '사진을 불러오지 못했어요.');
      }
    } finally {
      setPicking(false);
      refreshMediaPermissions();
    }
  };

  const onRequestMediaPermissions = async () => {
    setRequestingPerm(true);
    setError(null);
    setPermBlocked(false);
    try {
      await requestMediaPermissions();
    } finally {
      setRequestingPerm(false);
    }
  };

  const onSave = async () => {
    if (!draftPhotoUri) {
      setError('밥 사진을 추가해 주세요.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const recordId =
        todayRecord?.id ?? `meal-${todayKey}-${Date.now()}`;
      const savedPath = `file://${mealPhotoFilePath(recordId)}`;
      let photoPath = todayRecord?.photoPath;

      if (draftPhotoUri !== savedPath && draftPhotoUri !== todayRecord?.photoPath) {
        if (todayRecord?.photoPath) {
          await deleteMealPhotoFile(todayRecord.photoPath);
        }
        photoPath = await persistMealPhotoFromUri(draftPhotoUri, recordId);
      } else if (draftPhotoUri.startsWith('file://')) {
        photoPath = draftPhotoUri;
      }

      await saveMealRecord({
        date: today,
        menu,
        mood,
        memo,
        photoPath,
      });
      formDirtyRef.current = false;
      await refresh({ syncForm: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteToday = async () => {
    setSaving(true);
    setError(null);
    try {
      await deleteMealRecord(todayKey);
      setMenu(prefilledMenu ?? '');
      setMood('good');
      setMemo('');
      setDraftPhotoUri(null);
      formDirtyRef.current = false;
      await refresh({ syncForm: true });
    } catch {
      setError('삭제에 실패했어요.');
    } finally {
      setSaving(false);
    }
  };

  const shiftMonth = (delta: number) => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1),
    );
  };

  return (
    <View style={styles.root}>
      <ScreenContainer contentStyle={styles.screen}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← 홈</Text>
        </Pressable>

        <View style={styles.hero}>
          <QuailMascot size="sm" />
          <Text style={styles.title}>오늘의 밥친구</Text>
          <Text style={styles.sub}>
            오늘 먹은 밥을 사진으로 남기면{'\n'}나중에 스토리처럼 모아볼 수 있어요
          </Text>
          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{formatTodayLabel(today)}</Text>
          </View>
        </View>

        {showAllowButton || showPermSettings ? (
          <View style={[styles.permBanner, shadows.card]}>
            <Text style={styles.permBannerTitle}>사진·카메라 권한이 필요해요</Text>
            <Text style={styles.permBannerSub}>
              「권한 허용」을 누르면 iOS 설정 → 메추리에 사진·카메라 항목이
              생겨요.
            </Text>
            {showPermSettings ? (
              <Pressable
                onPress={openMealPhotoSettings}
                style={styles.permBannerBtn}>
                <Text style={styles.permBannerBtnText}>설정에서 허용하기</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={onRequestMediaPermissions}
                disabled={requestingPerm}
                style={styles.permBannerBtn}>
                {requestingPerm ? (
                  <ActivityIndicator color={colors.brown} size="small" />
                ) : (
                  <Text style={styles.permBannerBtnText}>권한 허용하기</Text>
                )}
              </Pressable>
            )}
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.orange}
            style={styles.loader}
          />
        ) : (
          <>
            {storyRecords.length > 0 ? (
              <View style={styles.storySection}>
                <Text style={styles.storySectionTitle}>밥친구 스토리</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.storyStrip}>
                  {storyRecords.map((item) => {
                    const uri = mealRecordImageUri(item)!;
                    const isToday = item.date === todayKey;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => openStoryAt(item)}
                        style={styles.storyThumbWrap}
                        accessibilityLabel={`${item.menu} 스토리`}>
                        <Image source={{ uri }} style={styles.storyThumb} />
                        {isToday ? <View style={styles.storyTodayRing} /> : null}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}

            <View style={[styles.card, shadows.card]}>
              <Text style={styles.cardTitle}>
                {todayRecord ? '오늘 스토리 수정' : '오늘의 밥 올리기'}
              </Text>

              <View style={styles.storyFrame}>
                {draftPhotoUri ? (
                  <>
                    <Image
                      source={{ uri: draftPhotoUri }}
                      style={styles.storyImage}
                      resizeMode="cover"
                    />
                    <View style={styles.storyOverlay}>
                      <TextInput
                        style={styles.storyMenuInput}
                        value={menu}
                        onChangeText={(text) => {
                  formDirtyRef.current = true;
                  setMenu(text);
                }}
                        placeholder="메뉴 이름 (선택)"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        editable={!saving}
                      />
                    </View>
                    <View style={styles.storyChangeRow}>
                      <Pressable
                        disabled={picking || saving}
                        onPress={() => onPickPhoto('camera')}
                        style={styles.storyChangeBtn}>
                        <Text style={styles.storyChangeText}>다시 촬영</Text>
                      </Pressable>
                      <Pressable
                        disabled={picking || saving}
                        onPress={() => onPickPhoto('library')}
                        style={styles.storyChangeBtn}>
                        <Text style={styles.storyChangeText}>갤러리</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View style={styles.storyEmpty}>
                    <Text style={styles.storyEmptyTitle}>사진으로 기록해요</Text>
                    <Text style={styles.storyEmptySub}>
                      인스타 스토리처럼 오늘의 밥을 남겨요
                      {__DEV__ && Platform.OS === 'ios'
                        ? '\n(시뮬레이터는 갤러리만 가능, 촬영은 실기기)'
                        : ''}
                    </Text>
                    <View style={styles.pickRow}>
                      <Pressable
                        disabled={picking || saving}
                        onPress={() => onPickPhoto('camera')}
                        style={[styles.pickBtn, shadows.card]}>
                        <Text style={styles.pickBtnEmoji}>📷</Text>
                        <Text style={styles.pickBtnLabel}>촬영</Text>
                      </Pressable>
                      <Pressable
                        disabled={picking || saving}
                        onPress={() => onPickPhoto('library')}
                        style={[styles.pickBtn, shadows.card]}>
                        <Text style={styles.pickBtnEmoji}>🖼</Text>
                        <Text style={styles.pickBtnLabel}>갤러리</Text>
                      </Pressable>
                    </View>
                    {picking ? (
                      <ActivityIndicator
                        color={colors.orange}
                        style={{ marginTop: 12 }}
                      />
                    ) : null}
                  </View>
                )}
              </View>

              <Text style={styles.inputLabel}>만족도</Text>
              <View style={styles.moodRow}>
                {MOODS.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      formDirtyRef.current = true;
                      setMood(item.id);
                    }}
                    disabled={saving}
                    style={[
                      styles.moodChip,
                      mood === item.id && styles.moodChipActive,
                    ]}>
                    <Text style={styles.moodEmoji}>{item.emoji}</Text>
                    <Text
                      style={[
                        styles.moodLabel,
                        mood === item.id && styles.moodLabelActive,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.inputLabel}>한 줄 메모 (선택)</Text>
              <TextInput
                style={[styles.input, styles.memoInput]}
                value={memo}
                onChangeText={(text) => {
                  formDirtyRef.current = true;
                  setMemo(text);
                }}
                placeholder="동료랑 먹었어요, 양 많았어요..."
                placeholderTextColor={colors.taupe}
                multiline
                editable={!saving}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {permBlocked ? (
                <Pressable
                  onPress={openMealPhotoSettings}
                  style={styles.settingsBtn}>
                  <Text style={styles.settingsBtnText}>설정에서 권한 허용하기</Text>
                </Pressable>
              ) : null}

              <FeatureActionButton
                label={todayRecord ? '스토리 저장' : '밥친구에게 올리기'}
                iconImage={riceIcon}
                tint={homeTileTints.meal}
                loading={saving}
                disabled={saving || !draftPhotoUri}
                onPress={onSave}
              />

              {todayRecord ? (
                <Pressable
                  onPress={onDeleteToday}
                  disabled={saving}
                  style={styles.deleteBtn}>
                  <Text style={styles.deleteText}>오늘 스토리 삭제</Text>
                </Pressable>
              ) : null}
            </View>

            {recentStories.length > 0 ? (
              <View style={styles.gallerySection}>
                <Text style={styles.galleryTitle}>최근 밥친구</Text>
                <View style={styles.galleryGrid}>
                  {recentStories.map((item) => {
                    const uri = mealRecordImageUri(item)!;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => openStoryAt(item)}
                        style={[styles.galleryItem, shadows.card]}>
                        <Image source={{ uri }} style={styles.galleryImage} />
                        <View style={styles.galleryCaption}>
                          <Text style={styles.galleryMenu} numberOfLines={1}>
                            {item.menu}
                          </Text>
                          <Text style={styles.galleryDate}>
                            {formatShortDate(item.date)}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={[styles.card, shadows.card]}>
              <View style={styles.monthHeader}>
                <Pressable onPress={() => shiftMonth(-1)} hitSlop={8}>
                  <Text style={styles.monthNav}>‹</Text>
                </Pressable>
                <Text style={styles.monthTitle}>
                  {viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월
                </Text>
                <Pressable onPress={() => shiftMonth(1)} hitSlop={8}>
                  <Text style={styles.monthNav}>›</Text>
                </Pressable>
              </View>
              <View style={styles.weekRow}>
                {WEEKDAY_LABELS.map((w) => (
                  <Text key={w} style={styles.weekLabel}>
                    {w}
                  </Text>
                ))}
              </View>
              <View style={styles.calGrid}>
                {calendarCells.map((cell, index) =>
                  cell ? (
                    <View key={cell.key} style={styles.calCell}>
                      <View
                        style={[
                          styles.calDay,
                          cell.key === todayKey && styles.calDayToday,
                          recordDates.has(cell.key) && styles.calDayStamped,
                        ]}>
                        <Text
                          style={[
                            styles.calDayText,
                            cell.key === todayKey && styles.calDayTextToday,
                            recordDates.has(cell.key) &&
                              styles.calDayTextStamped,
                          ]}>
                          {cell.day}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <View key={`empty-${index}`} style={styles.calCell} />
                  ),
                )}
              </View>
              <Text style={styles.calHint}>
                노란 날 = 사진 스토리 있음 · 탭해서 모아보기
              </Text>
            </View>
          </>
        )}
      </ScreenContainer>

      <MealStoryViewer
        visible={storyOpen}
        records={storyRecords}
        initialIndex={storyIndex}
        onClose={() => setStoryOpen(false)}
      />
    </View>
  );
}

const STORY_ASPECT = 4 / 5;

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { paddingBottom: 36 },
  back: { marginTop: 4, marginBottom: 8, alignSelf: 'flex-start' },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.tileText,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.brown,
    marginTop: 8,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.taupe,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 22,
  },
  dateBadge: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  dateBadgeText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.brown,
  },
  loader: { marginVertical: 24 },
  permBanner: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 14,
    marginBottom: 14,
  },
  permBannerTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 6,
  },
  permBannerSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
    lineHeight: 18,
    marginBottom: 10,
  },
  permBannerBtn: {
    alignSelf: 'flex-start',
    backgroundColor: homeTileTints.meal,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: 'center',
  },
  permBannerBtnText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
  },
  storySection: { marginBottom: 14 },
  storySectionTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brown,
    marginBottom: 10,
  },
  storyStrip: { gap: 10, paddingRight: 8 },
  storyThumbWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  storyThumb: { width: '100%', height: '100%' },
  storyTodayRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: colors.orange,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 12,
  },
  storyFrame: {
    width: '100%',
    aspectRatio: STORY_ASPECT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    marginBottom: 14,
  },
  storyImage: { width: '100%', height: '100%' },
  storyOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  storyMenuInput: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.white,
    padding: 0,
  },
  storyChangeRow: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 6,
  },
  storyChangeBtn: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  storyChangeText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.white,
  },
  storyEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  storyEmptyTitle: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.brown,
    marginBottom: 6,
  },
  storyEmptySub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textAlign: 'center',
    marginBottom: 16,
  },
  pickRow: { flexDirection: 'row', gap: 12 },
  pickBtn: {
    width: 100,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  pickBtnEmoji: { fontSize: 28, marginBottom: 6 },
  pickBtnLabel: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
  },
  inputLabel: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.brown,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.brown,
    backgroundColor: colors.cream,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  memoInput: { minHeight: 72, textAlignVertical: 'top' },
  moodRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  moodChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    backgroundColor: colors.cream,
  },
  moodChipActive: {
    backgroundColor: homeTileTints.meal,
    borderColor: colors.orange,
  },
  moodEmoji: { fontSize: 22, marginBottom: 4 },
  moodLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.taupe,
  },
  moodLabelActive: {
    fontFamily: fonts.display,
    color: colors.brown,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.red,
    marginBottom: 8,
    textAlign: 'center',
  },
  settingsBtn: {
    alignSelf: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  settingsBtnText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
    textDecorationLine: 'underline',
  },
  deleteBtn: {
    alignSelf: 'center',
    marginTop: 12,
    padding: 8,
  },
  deleteText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
    textDecorationLine: 'underline',
  },
  gallerySection: { marginBottom: 14 },
  galleryTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
    marginBottom: 10,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryItem: {
    width: '48%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  galleryImage: {
    width: '100%',
    aspectRatio: 1,
  },
  galleryCaption: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  galleryMenu: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.brown,
  },
  galleryDate: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    marginTop: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  monthNav: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.brown,
    paddingHorizontal: 12,
  },
  monthTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brown,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    marginBottom: 6,
  },
  calDay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayToday: {
    borderWidth: 2,
    borderColor: colors.orange,
  },
  calDayStamped: {
    backgroundColor: colors.yellow,
  },
  calDayText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.taupe,
  },
  calDayTextToday: {
    fontFamily: fonts.display,
    color: colors.brown,
  },
  calDayTextStamped: {
    fontFamily: fonts.display,
    color: colors.brown,
  },
  calHint: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.taupe,
    textAlign: 'center',
    marginTop: 8,
  },
});
