import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { VIDEO_PLAYBACK_RATE } from '../constants/video';
import MechuriVideoFrame, { isVideoNativeLinked } from './MechuriVideoFrame';

const FALLBACK_MS = Math.round(2400 / VIDEO_PLAYBACK_RATE);
const MAX_PLAY_MS = Math.round(12000 / VIDEO_PLAYBACK_RATE);

type Props = {
  onComplete: () => void;
};

export default function RevealVideo({ onComplete }: Props) {
  const finished = useRef(false);
  const hasVideo = isVideoNativeLinked();

  const finish = () => {
    if (finished.current) {
      return;
    }
    finished.current = true;
    onComplete();
  };

  useEffect(() => {
    if (!hasVideo) {
      const timer = setTimeout(finish, FALLBACK_MS);
      return () => clearTimeout(timer);
    }
    const safety = setTimeout(finish, MAX_PLAY_MS);
    return () => clearTimeout(safety);
  }, [hasVideo]);

  return (
    <View style={styles.wrap}>
      <MechuriVideoFrame
        repeat={false}
        onEnd={finish}
        onError={finish}
        style={styles.frame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  frame: {
    flex: 1,
    justifyContent: 'center',
  },
});
