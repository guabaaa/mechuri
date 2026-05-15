import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  diceIcon,
  mechuriLogo,
  notificationIcon,
  notificationIconRed,
} from '../assets';
import { FeatureTile, QuailMascot, ScreenContainer } from '../components';
import { useNotifications } from '../context/NotificationContext';
import type { HomeStackParamList } from '../navigation/types';
import {
  colors,
  homeScreenPadding,
  homeTileGap,
  homeTileHeight,
  homeTileTints,
} from '../theme';
import { fonts } from '../theme/typography';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const tileWidth =
    (screenWidth - homeScreenPadding * 2 - homeTileGap) / 2;
  const { hasUnread, markRead } = useNotifications();

  const onNotificationPress = () => {
    if (hasUnread) {
      markRead();
    }
    // TODO: 알림 목록 화면 연결
  };

  return (
    <ScreenContainer contentStyle={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onNotificationPress}
          style={styles.bell}
          accessibilityLabel={
            hasUnread ? '읽지 않은 알림 있음' : '알림'
          }
          hitSlop={12}>
          <Image
            source={hasUnread ? notificationIconRed : notificationIcon}
            style={styles.bellIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.brandBlock}>
        <Image
          source={mechuriLogo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="메추리"
        />
        <Text style={styles.tagline}>오늘 뭐 먹지? 메추리가 골라줄게요</Text>
      </View>

      <View style={styles.hero}>
        <QuailMascot size="lg" />
      </View>

      <View style={[styles.grid, { gap: homeTileGap }]}>
        <View style={[styles.row, { gap: homeTileGap }]}>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              iconImage={diceIcon}
              label={'오늘 메뉴\n뽑기'}
              tint={homeTileTints.menu}
              onPress={() => navigation.navigate('TodayPick')}
            />
          </View>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              icon="🧠"
              label={'메비티아이\n테스트'}
              tint={homeTileTints.mbti}
              onPress={() => navigation.navigate('MbtiTest')}
            />
          </View>
        </View>
        <View style={[styles.row, { gap: homeTileGap }]}>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              icon="🛵"
              label={'배달 메뉴\n뽑기'}
              tint={homeTileTints.delivery}
              onPress={() => navigation.navigate('DeliveryPick')}
            />
          </View>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              icon="📍"
              label={'근처에서\n먹기'}
              tint={homeTileTints.nearby}
              onPress={() => navigation.navigate('NearbyPick')}
            />
          </View>
        </View>
        <View style={[styles.row, { gap: homeTileGap }]}>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              icon="🪜"
              label={'메뉴\n사다리타기'}
              tint={homeTileTints.ladder}
              onPress={() => navigation.navigate('Ladder')}
            />
          </View>
          <View style={{ width: tileWidth, height: homeTileHeight }}>
            <FeatureTile
              icon="✨"
              label={'오늘의\n운세'}
              tint={homeTileTints.fortune}
              onPress={() => navigation.navigate('Fortune')}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 4,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  bell: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 44,
    height: 44,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 48,
  },
  logo: {
    width: 220,
    height: 80,
  },
  tagline: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.taupe,
    marginTop: 10,
    lineHeight: 24,
    textAlign: 'center',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginBottom: 28,
    paddingTop: 8,
  },
  grid: {
    marginBottom: 8,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
});
