import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { calIcon } from '../assets';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import { formatBirthdayInput } from '../utils/date';

const DEFAULT_BIRTH = new Date(1995, 5, 15);
const MIN_BIRTH = new Date(1920, 0, 1);

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
  disabled?: boolean;
};

export default function BirthdayDatePicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerDate = value ?? DEFAULT_BIRTH;
  const maximumDate = new Date();

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setPickerOpen(false);
    }
    if (event.type === 'dismissed' || !selected) {
      return;
    }
    onChange(selected);
  };

  const openPicker = () => {
    if (!disabled) {
      setPickerOpen(true);
    }
  };

  const closePicker = () => {
    setPickerOpen(false);
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value ? formatBirthdayInput(value) : '생년월일을 선택해 주세요'}
        </Text>
        <Pressable
          onPress={pickerOpen && Platform.OS === 'ios' ? closePicker : openPicker}
          disabled={disabled}
          hitSlop={12}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && styles.iconBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="생년월일 선택"
          accessibilityHint="탭하면 날짜 선택기가 열립니다">
          <Image
            source={calIcon}
            style={styles.calIcon}
            resizeMode="contain"
            accessibilityElementsHidden
          />
        </Pressable>
      </View>

      {Platform.OS === 'ios' && pickerOpen ? (
        <View style={styles.iosPickerWrap}>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="spinner"
            locale="ko-KR"
            minimumDate={MIN_BIRTH}
            maximumDate={maximumDate}
            onChange={onPickerChange}
            themeVariant="light"
            style={styles.iosPicker}
          />
          <Pressable onPress={closePicker} style={styles.doneBtn}>
            <Text style={styles.doneText}>선택 완료</Text>
          </Pressable>
        </View>
      ) : null}

      {Platform.OS === 'android' && pickerOpen ? (
        <DateTimePicker
          value={pickerDate}
          mode="date"
          display="default"
          minimumDate={MIN_BIRTH}
          maximumDate={maximumDate}
          onChange={onPickerChange}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    paddingLeft: 14,
    paddingRight: 6,
  },
  value: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.brown,
    paddingVertical: 12,
  },
  placeholder: { color: colors.taupe },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconBtnPressed: { opacity: 0.7 },
  calIcon: { width: 24, height: 24 },
  iosPickerWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  iosPicker: {
    height: 180,
    width: '100%',
  },
  doneBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.orange,
  },
});
