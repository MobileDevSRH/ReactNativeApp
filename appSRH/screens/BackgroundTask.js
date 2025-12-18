import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function SimpleTimer() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    async function checkPerms() {
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Current Permission Status:", status);
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        console.log("New Permission Status:", newStatus);
        if (newStatus !== 'granted') {
          Alert.alert("Error", "Notification permissions are required!");
        }
      }
    }
    checkPerms();
  }, []);

const handleStart = async () => {
    try {
      console.log("Attempting to schedule...");
      
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Error", "Notifications are not allowed.");
        return;
      }

      await Notifications.cancelAllScheduledNotificationsAsync();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Background Tasks",
          body: "It works!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, 
          seconds: 10,
          repeats: false,
        },
      });

      console.log("Notification scheduled successfully!");
      setIsTimerRunning(true);
      Alert.alert("Started", "Wait 10 seconds...");
      
    } catch (error) {
      console.error("SCHEDULING ERROR:", error);
      Alert.alert("Error", "Failed to schedule: " + error.message);
    }
  };

  const handleStop = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setIsTimerRunning(false);
    Alert.alert("Stopped", "Timer cancelled.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Background Task</Text>
      <Button 
        title={isTimerRunning ? "CANCEL" : "START 10s Timer"} 
        onPress={isTimerRunning ? handleStop : handleStart}
        color={isTimerRunning ? "red" : "green"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});