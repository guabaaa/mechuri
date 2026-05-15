import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { faceIcon } from '../assets';
import { colors } from '../theme';
import { fonts } from '../theme/typography';
import {
  bridgeAtRow,
  type LadderLayout,
} from '../utils/ladderGame';

const SCREEN_PADDING = 40;
const ROW_HEIGHT = 36;
const LINE = 3;
const PAD_TOP = 4;
const MAX_COL_WIDTH = 64;
const MARKER_SIZE = 30;
const MARKER_HALF = MARKER_SIZE / 2;
/** LadderScreen ROW_MS 와 맞출 것 */
const ROW_STEP_MS = 280;
const STEP_EASE = Easing.inOut(Easing.cubic);

type Props = {
  layout: LadderLayout;
  /** -1 = 출발, 0..rows-1 = 해당 가로 단 */
  activeRow?: number;
  /** true일 때만 당첨 칸·이름 강조 */
  revealWinner?: boolean;
};

function colCenter(col: number, colWidth: number) {
  return col * colWidth + colWidth / 2;
}

export default function LadderBoard({
  layout,
  activeRow,
  revealWinner = false,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const { items, rows, bridges, startCol, winnerCol, path } = layout;
  const n = items.length;
  const ladderHeight = rows * ROW_HEIGHT;

  const colWidth = useMemo(() => {
    const boardWidth = windowWidth - SCREEN_PADDING;
    return Math.min(MAX_COL_WIDTH, Math.floor(boardWidth / n));
  }, [n, windowWidth]);

  const boardWidth = colWidth * n;
  const labelSize = colWidth < 40 ? 9 : colWidth < 52 ? 10 : 11;

  const passedRows =
    activeRow == null || activeRow < 0 ? -1 : Math.min(activeRow, rows - 1);

  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;
  const moveAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    moveAnimRef.current?.stop();

    if (activeRow == null || activeRow < 0) {
      animX.setValue(colCenter(startCol, colWidth) - MARKER_HALF);
      animY.setValue(PAD_TOP - MARKER_HALF);
      return;
    }

    const row = Math.min(activeRow, rows - 1);
    const fromCol = path[row] ?? startCol;
    const toCol = path[row + 1] ?? fromCol;
    const bridgeY = PAD_TOP + row * ROW_HEIGHT + ROW_HEIGHT / 2 - MARKER_HALF;
    const toX = colCenter(toCol, colWidth) - MARKER_HALF;

    const totalMs = ROW_STEP_MS - 12;
    const verticalMs = fromCol === toCol ? totalMs : Math.round(totalMs * 0.55);
    const horizontalMs = totalMs - verticalMs;

    const steps: Animated.CompositeAnimation[] = [
      Animated.timing(animY, {
        toValue: bridgeY,
        duration: verticalMs,
        easing: STEP_EASE,
        useNativeDriver: true,
      }),
    ];

    if (fromCol !== toCol) {
      steps.push(
        Animated.timing(animX, {
          toValue: toX,
          duration: horizontalMs,
          easing: STEP_EASE,
          useNativeDriver: true,
        }),
      );
    } else {
      animX.setValue(toX);
    }

    moveAnimRef.current = Animated.sequence(steps);
    moveAnimRef.current.start();

    return () => {
      moveAnimRef.current?.stop();
    };
  }, [activeRow, animX, animY, colWidth, path, rows, startCol]);

  return (
    <View style={[styles.wrap, { width: boardWidth }]}>
      <View style={styles.topRow}>
        {items.map((_, col) => (
          <View key={`top-${col}`} style={[styles.col, { width: colWidth }]}>
            {col === startCol ? (
              <View style={styles.startBadge}>
                <Text style={styles.startText}>START</Text>
              </View>
            ) : (
              <View style={styles.startPlaceholder} />
            )}
          </View>
        ))}
      </View>

      <View style={[styles.ladderArea, { height: ladderHeight + PAD_TOP * 2 }]}>
        <View
          style={[
            styles.line,
            {
              left: colCenter(startCol, colWidth) - LINE / 2,
              top: 0,
              width: LINE,
              height: PAD_TOP + ROW_HEIGHT / 2,
              backgroundColor:
                passedRows >= 0 && path[0] === startCol
                  ? colors.orange
                  : colors.brown,
            },
          ]}
        />

        {Array.from({ length: n }, (_, col) =>
          Array.from({ length: rows }, (_, row) => {
            const x = colCenter(col, colWidth) - LINE / 2;
            const y = PAD_TOP + row * ROW_HEIGHT;
            const onPath =
              passedRows >= row &&
              path[row] === col &&
              path[row + 1] === col;
            return (
              <View
                key={`v-${col}-${row}`}
                style={[
                  styles.line,
                  {
                    left: x,
                    top: y,
                    width: LINE,
                    height: ROW_HEIGHT,
                    backgroundColor: onPath ? colors.orange : colors.brown,
                  },
                ]}
              />
            );
          }),
        )}

        {bridges.map((rowBridges, row) =>
          rowBridges.map((on, col) => {
            if (!on) {
              return null;
            }
            const usedBridge = bridgeAtRow(layout, row) === col;
            const onPath = passedRows >= row && usedBridge;
            return (
              <View
                key={`h-${row}-${col}`}
                style={[
                  styles.line,
                  {
                    top: PAD_TOP + row * ROW_HEIGHT + ROW_HEIGHT / 2 - LINE / 2,
                    left: colCenter(col, colWidth),
                    width: colWidth,
                    height: LINE,
                    backgroundColor: onPath ? colors.orange : colors.brown,
                  },
                ]}
              />
            );
          }),
        )}

        {activeRow != null && activeRow >= -1 ? (
          <Animated.View
            style={[
              styles.marker,
              {
                transform: [
                  { translateX: animX },
                  { translateY: animY },
                ],
              },
            ]}>
            <Image
              source={faceIcon}
              style={styles.markerImage}
              resizeMode="contain"
            />
          </Animated.View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        {items.map((item, col) => {
          const isWinner = revealWinner && winnerCol === col;
          return (
            <View
              key={`bot-${col}`}
              style={[
                styles.menuCell,
                { width: colWidth },
                isWinner && styles.menuCellWin,
              ]}>
              <Text
                style={[
                  styles.menuText,
                  { fontSize: labelSize, lineHeight: labelSize + 3 },
                  isWinner && styles.menuTextWin,
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.7}>
                {revealWinner ? item : '?'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    marginVertical: 8,
    maxWidth: '100%',
  },
  topRow: {
    flexDirection: 'row',
    height: 28,
    marginBottom: 4,
  },
  col: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  startBadge: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  startText: {
    fontFamily: fonts.display,
    fontSize: 8,
    color: colors.brown,
  },
  startPlaceholder: { height: 18 },
  ladderArea: {
    position: 'relative',
    width: '100%',
  },
  line: {
    position: 'absolute',
    borderRadius: 2,
    opacity: 0.92,
  },
  marker: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    zIndex: 3,
  },
  markerImage: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  menuCell: {
    paddingHorizontal: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 10,
  },
  menuCellWin: {
    backgroundColor: colors.yellow,
    borderWidth: 2,
    borderColor: colors.tileBorder,
  },
  menuText: {
    fontFamily: fonts.body,
    color: colors.tileText,
    textAlign: 'center',
  },
  menuTextWin: {
    fontFamily: fonts.display,
    color: colors.brown,
  },
});
