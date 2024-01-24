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
  const viewShotRef = useRef(null);
  const [img, setImage] = useState<string | undefined>(undefined);
  const [canvasImage, setCanvasImage] = useState<string | undefined>(undefined);

  async function hasAndroidPermission() {
    const getCheckPermissionPromise = () => {
      // @ts-ignore
      if (Platform.Version >= 33) {
        return Promise.all([
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          ),
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ),
        ]).then(
          ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
            hasReadMediaImagesPermission && hasReadMediaVideoPermission,
        );
      } else {
        return PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
      return true;
    }
    const getRequestPermissionPromise = () => {
      // @ts-ignore
      if (Platform.Version >= 33) {
        return PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]).then(
          statuses =>
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
      }
    };

    return await getRequestPermissionPromise();
  }

  React.useEffect(() => {
    const subscription = Shake.addListener(async () => {
      await capture();
      setTimeout(async () => {
        await captureCanvas();
      }, 1000);

      // Your code here...
    });

    return () => {
      // Your code here...
      subscription.remove();
    };
  }, []);

  async function capture() {
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

        await savePicture(uri);

        // setCanvasImage(uri);
      } catch (error) {
        console.error('Error capturing canvas:', error);
      }
    }
  };

  async function savePicture(tag: string) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    CameraRoll.save(tag).then(() => {
      console.log('shaked');
      console.log('saved');
    });
  }

  return (
    <View style={{ backgroundColor: 'orange', flex: 1 }}>
      <Button title={'CaptureToUpdateCanvas'} onPress={capture} />
      <Button title={'CaptureRootView'} onPress={captureCanvas} />
      <SafeAreaView style={{ position: 'absolute', left: -9999, top: -9999 }}>
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
          <RnImage source={{ uri: img, width: wWid, height: wHeight - 40 }} />
          <Text style={{ height: 40, position: 'absolute', top: 20, left: 10 }}>
            stage and 1.2.41.4
          </Text>
        </ViewShot>
      </SafeAreaView>
    </View>
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
