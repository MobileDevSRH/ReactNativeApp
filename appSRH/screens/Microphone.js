import { View, Button, StyleSheet, Alert } from "react-native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

export default function Microphone() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    console.log("starting recording...");
    console.log("state before recording:", recorderState);
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    const uri = audioRecorder.uri;
    if (!uri) {
      Alert.alert("Error", "No recording URI found");
      return;
    }

    await saveToPublicLibrary(uri);
  };

  const saveToPublicLibrary = async (uri) => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required");
      return;
    }

    await MediaLibrary.createAssetAsync(uri);

    Alert.alert(
      "Saved",
      "Recording saved. Find it in Files → Audio or Media → Music."
    );
  } catch (e) {
    console.error(e);
    Alert.alert("Error saving recording");
  }
};


  useEffect(() => {
    (async () => {
      const status = await AudioModule.getRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone is required!");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title={
            recorderState.isRecording ? "Stop Recording" : "Start Recording"
          }
          onPress={recorderState.isRecording ? stopRecording : record}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  buttonContainer: {
    marginTop: 20,
    width: "50%",
  },
});
