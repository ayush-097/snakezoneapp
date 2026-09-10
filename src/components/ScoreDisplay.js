// ScoreDisplay - Shows current score and rank in bottom-left
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScoreDisplay = ({ score = 0, rank = 1, totalPlayers = 10 }) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.label}>SCORE</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      <Text style={styles.rankValue}>
        Rank: #{rank} / {totalPlayers}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    minWidth: 120,
    backgroundColor: 'rgba(15, 15, 25, 0.85)',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
    zIndex: 1000,
  },
  label: {
    fontSize: 8,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00ffcc',
    marginVertical: 2,
    // Text shadow approximation
    textShadowColor: 'rgba(0, 255, 204, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rankValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#cc99ff',
  },
});

export default React.memo(ScoreDisplay);
