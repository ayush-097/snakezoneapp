// GameOverModal - Death screen with trophy, score, rank, and restart button
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import Svg, {
  Path,
  Rect,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const GameOverModal = ({ visible, score = 0, rank = 1, onRestart }) => {
  const overlayOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0.95);
  const containerTranslateY = useSharedValue(30);
  const trophyFloat = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      containerScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      containerTranslateY.value = withSpring(0, { damping: 10, stiffness: 100 });

      // Trophy floating animation
      trophyFloat.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      overlayOpacity.value = 0;
      containerScale.value = 0.95;
      containerTranslateY.value = 30;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: containerTranslateY.value },
      { scale: containerScale.value },
    ],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: trophyFloat.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Animated.View style={[styles.container, containerStyle]}>
        {/* Result Header */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>Result</Text>
        </View>

        {/* Trophy */}
        <Animated.View style={[styles.trophyContainer, trophyStyle]}>
          <Svg width={160} height={160} viewBox="0 0 100 100">
            <Defs>
              <LinearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFDF00" />
                <Stop offset="50%" stopColor="#DAA520" />
                <Stop offset="100%" stopColor="#B8860B" />
              </LinearGradient>
              <LinearGradient id="gold-grad-light" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#FFF8DC" />
                <Stop offset="50%" stopColor="#FFDF00" />
                <Stop offset="100%" stopColor="#DAA520" />
              </LinearGradient>
            </Defs>
            <Path
              d="M22,35 C0,35 0,65 35,60 M78,35 C100,35 100,65 65,60"
              fill="none"
              stroke="url(#gold-grad)"
              strokeWidth={8}
              strokeLinecap="round"
            />
            <Path d="M40,75 L60,75 L65,90 L35,90 Z" fill="#DAA520" />
            <Rect x={25} y={90} width={50} height={8} rx={4} fill="#B8860B" />
            <Path
              d="M15,20 L85,20 C85,50 70,75 50,75 C30,75 15,50 15,20 Z"
              fill="url(#gold-grad)"
            />
            <Ellipse cx={50} cy={20} rx={35} ry={6} fill="url(#gold-grad-light)" />
          </Svg>

          {/* Rank badge on trophy */}
          <View style={styles.trophyBadge}>
            <Text style={styles.crown}>👑</Text>
            <Text style={styles.rankNumber}>{rank}</Text>
          </View>
        </Animated.View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>
            {score.toLocaleString()}
          </Text>
        </View>

        {/* Restart Button */}
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={onRestart}
          activeOpacity={0.8}
        >
          <Text style={styles.restartIcon}>↻</Text>
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 10, 30, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  resultHeader: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#ffeb3b',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
  },
  trophyContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyBadge: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ff9800',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    minWidth: 40,
  },
  crown: {
    fontSize: 16,
    marginBottom: -2,
  },
  rankNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: '#e65100',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: '800',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#a5d6a7',
    backgroundColor: '#2e7d32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  restartIcon: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginRight: 10,
  },
  restartText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
});

export default React.memo(GameOverModal);
