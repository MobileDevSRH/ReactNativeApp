import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Image, SafeAreaView, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';

export default function CameraUpload() {
  const insets = useSafeAreaInsets();
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission is required.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo);
      } catch (err) {
        console.error('Error taking picture', err);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const requestMediaLibraryPermission = async () => {
    try {
      let status;
      if (Platform.OS === 'ios') {
        const result = await MediaLibrary.requestPermissionsAsync({ writeOnly: true });
        status = result.status;
      } else {
        const result = await MediaLibrary.requestPermissionsAsync();
        status = result.status;
      }
      return status === 'granted';
    } catch (err) {
      console.error('Error requesting media library permission:', err);
      return false;
    }
  };

 const savePicture = async () => {
  if (!capturedImage) return;

  const granted = await requestMediaLibraryPermission();
  if (!granted) {
    Alert.alert('Permission required', 'Need permission to save photos');
    return;
  }

  try {
    const asset = await MediaLibrary.createAssetAsync(capturedImage.uri);

    const ALBUM_NAME = 'MyAppPhotos';
    let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
    if (!album) {
      await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log('Saved photo URI:', asset.uri);
    Alert.alert('Photo Saved', 'Photo saved successfully!');
    setCapturedImage(null);
  } catch (err) {
    console.error('Error saving photo:', err);
    Alert.alert('Error', 'Failed to save photo');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Text style={styles.heading}>Photo Preview</Text>
          <Image source={{ uri: capturedImage.uri }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <Button title="Retake" onPress={() => setCapturedImage(null)} />
            <Button title="Save Photo" onPress={savePicture} />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} />
          <View style={[styles.captureButton, { bottom: 20 + insets.bottom }]}>
            <Button title="Capture Photo" onPress={takePicture} color="#1E90FF" />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  previewContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
});