// GameCanvas - Declarative Skia canvas for rendering game entities
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Canvas, Image, Circle, Rect, Group } from '@shopify/react-native-skia';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FOOD_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
];

const GameCanvas = ({ engineRef, images }) => {
  const [renderState, setRenderState] = useState({ foods: [], snakes: [] });

  useEffect(() => {
    let running = true;
    let lastTime = 0;

    const gameLoop = (timestamp) => {
      if (!running) return;
      requestAnimationFrame(gameLoop);

      const elapsed = timestamp - lastTime;
      if (elapsed < 33) return; // ~30fps cap
      lastTime = timestamp - (elapsed % 33);

      const engine = engineRef.current;
      if (!engine || engine.die) return;

      // 1. Update engine physics
      engine.update();

      // 2. Gather visible food
      const { offsetX, offsetY, gameW, gameH } = engine;
      const margin = 3 * engine.getSize();
      const visMinX = offsetX - margin;
      const visMaxX = offsetX + gameW + margin;
      const visMinY = offsetY - margin;
      const visMaxY = offsetY + gameH + margin;

      const foods = [];
      for (let i = 0; i < engine.food.length; i++) {
        const f = engine.food[i];
        if (f.x > visMinX && f.x < visMaxX && f.y > visMinY && f.y < visMaxY) {
          foods.push({
            id: i,
            cx: f.x - offsetX,
            cy: f.y - offsetY,
            r: Math.max(3, f.size),
            color: FOOD_COLORS[i % FOOD_COLORS.length],
          });
        }
      }

      // 3. Gather visible snake segments
      const snakes = [];
      for (let i = 0; i < engine.snakes.length; i++) {
        const segs = engine.snakes[i].getDrawData(images, offsetX, offsetY);
        for (let j = 0; j < segs.length; j++) {
          snakes.push({
            ...segs[j],
            id: `${i}-${j}`,
          });
        }
      }

      setRenderState({ foods, snakes });
    };

    requestAnimationFrame(gameLoop);
    return () => {
      running = false;
    };
  }, [engineRef, images]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {/* Screen Background */}
        <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} color="#1a1a2e" />

        {/* Map Image */}
        {images && images.background && (
          <Image
            image={images.background}
            x={0}
            y={0}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            fit="cover"
          />
        )}

        {/* Food Circles */}
        {renderState.foods.map((f) => (
          <Circle key={`f-${f.id}`} cx={f.cx} cy={f.cy} r={f.r} color={f.color} />
        ))}

        {/* Snakes */}
        {renderState.snakes.map((s) =>
          s.isHead ? (
            <Group
              key={`s-${s.id}`}
              origin={{ x: s.cx, y: s.cy }}
              transform={[{ rotate: s.angle - Math.PI / 2 }]}
            >
              <Image
                image={s.img}
                x={s.x}
                y={s.y}
                width={s.size}
                height={s.size}
              />
            </Group>
          ) : (
            <Image
              key={`s-${s.id}`}
              image={s.img}
              x={s.x}
              y={s.y}
              width={s.size}
              height={s.size}
            />
          )
        )}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default GameCanvas;
