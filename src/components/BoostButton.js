// BoostButton - Press and hold to boost speed
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const BOOST_SIZE = 100;

const BoostButton = ({ onBoostChange }) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const setBoost = useCallback(
    (boosting) => {
      if (onBoostChange) {
        onBoostChange(boosting);
      }
    },
    [onBoostChange]
  );

  const tapGesture = Gesture.LongPress()
    .minDuration(0)
    .onStart(() => {
      scale.value = withSpring(0.92, { damping: 15 });
      glowOpacity.value = withSpring(1, { damping: 15 });
      runOnJS(setBoost)(true);
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15 });
      glowOpacity.value = withSpring(0, { damping: 15 });
      runOnJS(setBoost)(false);
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15 });
      glowOpacity.value = withSpring(0, { damping: 15 });
      runOnJS(setBoost)(false);
    });

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.boostZone}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={[styles.boostBtn, buttonStyle]}>
          <Animated.View style={[styles.boostGlow, glowStyle]} />
          <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z"
              fill="white"
              stroke="white"
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  boostZone: {
    position: 'absolute',
    bottom: 110,
    right: 140,
    width: BOOST_SIZE,
    height: BOOST_SIZE,
    zIndex: 900,
  },
  boostBtn: {
    width: BOOST_SIZE,
    height: BOOST_SIZE,
    borderRadius: BOOST_SIZE / 2,
    backgroundColor: 'rgba(15, 15, 25, 0.95)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  boostGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BOOST_SIZE / 2,
    backgroundColor: 'rgba(255, 200, 50, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 200, 50, 0.4)',
  },
});

export default React.memo(BoostButton);
