/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useRef, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image as RnImage,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import ViewShot, { captureScreen } from 'react-native-view-shot';
import Canvas, { Image } from 'react-native-canvas';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const wWid = Dimensions.get('screen').width / 2;
const wHeight = Dimensions.get('screen').height / 2;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const canvasRef = useRef(null);
  const viewShotRef = useRef(null);
  const [img, setImage] = useState<string | null>(null);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  useEffect(() => {
    const updateCanvas = () => {
      if (canvasRef?.current === null) {
        return;
      }
      console.log('123');
      const ctx = canvasRef.current?.getContext('2d');

      // // Load your image
      const image = new Image(canvasRef.current, wHeight, wWid);
      image.src = img as string;
      // image.src =
      //   'https://upload.wikimedia.org/wikipedia/commons/6/63/Biho_Takashi._Bat_Before_the_Moon%2C_ca._1910.jpg' as string;

      image.addEventListener('load', () => {
        canvasRef.current.width = wWid;
        canvasRef.current.height = wHeight;
        ctx.drawImage(image, 0, 0, wWid, wHeight);
        ctx.fillStyle = 'black';
        ctx.font = '8px Arial';
        ctx.fillText(` version: 1129.10.1; env: STAGE`, 0, 10);
      });
    };
    updateCanvas();
  }, [img]);

  function capture() {
    captureScreen({
      format: 'jpg',
      quality: 0.8,
      // width: 50,
      // height: 50,
    }).then(
      uri => {
        setImage(uri);
      },
      error => console.error('Oops, snapshot failed', error),
    );
  }

  const captureCanvas = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        setCanvasImage(uri);
      } catch (error) {
        console.error('Error capturing canvas:', error);
      }
    }
  };

  console.log('capturedImage', canvasImage);
  return (
    <SafeAreaView style={{ backgroundColor: 'transparent' }}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'orange',
          top: -50,
          left: -50,
        }}>
        {/* <Text>version: 1123.124</Text>
          <Text>env: stage</Text> */}
      </View>
      <Button title={'CaptureToUpdateCanvas'} onPress={capture} />
      <Button title={'CaptureRootView'} onPress={captureCanvas} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header />
        <Text>Inserted env and ver for</Text>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'jpg', quality: 0.9 }}
          style={{ position: 'absolute', left: -9999, top: -9999 }}>
          <Canvas ref={canvasRef} style={{ width: wWid, height: wHeight }} />
        </ViewShot>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RnImage
          source={{ uri: canvasImage, width: wWid, height: wHeight }}
          style={{
            borderColor: 'red',
            borderWidth: 2,
            backgroundColor: 'red',
          }}
        />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
        </View>
      </ScrollView>
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
