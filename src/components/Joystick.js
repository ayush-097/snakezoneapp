// Joystick - Virtual joystick control using gesture handler
import React, { useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const JOYSTICK_SIZE = 140;
const KNOB_SIZE = 60;
const MAX_DIST = 40;

const Joystick = ({ onDirectionChange }) => {
  const knobX = useSharedValue(0);
  const knobY = useSharedValue(0);

  const updateDirection = useCallback(
    (dx, dy) => {
      if (onDirectionChange) {
        onDirectionChange(dx, dy);
      }
    },
    [onDirectionChange]
  );

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      const dx = event.x - JOYSTICK_SIZE / 2;
      const dy = event.y - JOYSTICK_SIZE / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, MAX_DIST);
      const angle = Math.atan2(dy, dx);

      knobX.value = Math.cos(angle) * clampedDist;
      knobY.value = Math.sin(angle) * clampedDist;

      const normDist = clampedDist / MAX_DIST;
      if (normDist > 0.1) {
        runOnJS(updateDirection)(
          Math.cos(angle) * normDist,
          Math.sin(angle) * normDist
        );
      }
    })
    .onUpdate((event) => {
      const dx = event.x - JOYSTICK_SIZE / 2;
      const dy = event.y - JOYSTICK_SIZE / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, MAX_DIST);
      const angle = Math.atan2(dy, dx);

      knobX.value = Math.cos(angle) * clampedDist;
      knobY.value = Math.sin(angle) * clampedDist;

      const normDist = clampedDist / MAX_DIST;
      if (normDist > 0.1) {
        runOnJS(updateDirection)(
          Math.cos(angle) * normDist,
          Math.sin(angle) * normDist
        );
      }
    })
    .onEnd(() => {
      knobX.value = withSpring(0, { damping: 15 });
      knobY.value = withSpring(0, { damping: 15 });
    })
    .onFinalize(() => {
      knobX.value = withSpring(0, { damping: 15 });
      knobY.value = withSpring(0, { damping: 15 });
    });

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }, { translateY: knobY.value }],
  }));

  return (
    <View style={styles.joystickZone}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.joystickBase}>
          <Animated.View style={[styles.joystickKnob, knobStyle]} />
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  joystickZone: {
    position: 'absolute',
    bottom: 110,
    left: 140,
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    zIndex: 900,
  },
  joystickBase: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    borderRadius: JOYSTICK_SIZE / 2,
    backgroundColor: 'rgba(20, 20, 30, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  joystickKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: 'rgba(150, 150, 170, 0.7)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default React.memo(Joystick);
