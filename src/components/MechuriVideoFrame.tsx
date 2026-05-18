import { ReactNode } from 'react';
import {
  Image,
  StyleSheet,
  UIManager,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { mechuriCharacter } from '../assets';
import { VIDEO_PLAYBACK_RATE } from '../constants/video';
import { colors } from '../theme';

const defaultSource = require('../assets/video/e_e_mp_.mp4');

export function isVideoNativeLinked(): boolean {
  return UIManager.getViewManagerConfig?.('RCTVideo') != null;
}

type Props = {
  onEnd?: () => void;
  onError?: () => void;
  repeat?: boolean;
  playbackRate?: number;
  source?: number;
  style?: ViewStyle;
  fallback?: ReactNode;
};

export default function MechuriVideoFrame({
  onEnd,
  onError,
  repeat = false,
  playbackRate = VIDEO_PLAYBACK_RATE,
  source = defaultSource,
  style,
  fallback,
}: Props) {
  const { width: screenW } = useWindowDimensions();
  const showVideo = isVideoNativeLinked();

  if (!showVideo) {
    return (
      <View style={[styles.center, style]}>
        {fallback ?? (
          <Image
            source={mechuriCharacter}
            style={{ width: screenW * 0.75, height: screenW * 0.75 }}
            resizeMode="contain"
            accessibilityLabel="메추리"
          />
        )}
      </View>
    );
  }

  const Video = require('react-native-video').default;
  return (
    <View style={[styles.center, style]}>
      <Video
        source={source}
        style={styles.video}
        resizeMode="cover"
        repeat={repeat}
        rate={playbackRate}
        muted
        volume={0}
        playInBackground={false}
        playWhenInactive={false}
        mixWithOthers="mix"
        disableFocus
        disableAudioSessionManagement
        onEnd={onEnd}
        onError={onError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  video: {
    ...StyleSheet.absoluteFill,
  },
});
