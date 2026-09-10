// App.js - Snake Zone React Native App with Hardware-Accelerated Web Canvas Engine
import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { GAME_HTML } from './src/gameHtml';

export default function App() {
  useEffect(() => {
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (e) {
        console.warn('Orientation lock error:', e);
      }
    }
    lockLandscape();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <WebView
        originWhitelist={['*']}
        source={{ html: GAME_HTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
});
