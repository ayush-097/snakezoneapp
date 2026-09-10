// Leaderboard - Glassmorphic leaderboard overlay
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Leaderboard = ({ data = [] }) => {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>LEADERBOARD</Text>
      {data.map((entry, index) => (
        <View
          key={`lb-${index}`}
          style={[styles.row, entry.isPlayer && styles.playerRow]}
        >
          <Text style={[styles.rank, entry.isPlayer && styles.playerRank]}>
            #{entry.rank}
          </Text>
          <Text
            style={[styles.name, entry.isPlayer && styles.playerName]}
            numberOfLines={1}
          >
            {entry.name}
          </Text>
          <Text style={styles.score}>{entry.score}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 160,
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
  title: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ff4fac',
    letterSpacing: 1.5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  playerRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  rank: {
    width: 24,
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  playerRank: {
    color: '#cc99ff',
  },
  name: {
    flex: 1,
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
    marginRight: 6,
  },
  playerName: {
    color: '#cc99ff',
    fontWeight: '700',
  },
  score: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00ffcc',
    textAlign: 'right',
  },
});

export default React.memo(Leaderboard);
