/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useRef } from 'react';
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Image as RnImage,
  View,
} from 'react-native';

import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import ViewShot, { captureScreen } from 'react-native-view-shot';
import Shake from 'react-native-shake';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const wWid = Dimensions.get('screen').width;
const wHeight = Dimensions.get('screen').height;

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={{ backgroundColor: 'orange', flex: 1 }}>
      <Text>Hello app js</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
