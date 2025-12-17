import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

// ----------------------------------------------------
// CONSTANTS
// ----------------------------------------------------
const TRACKER_TASK_NAME = 'SESSION_TIMER_TASK';
const START_TIME_KEY = 'trackerSessionStartTime';

// For testing
const REMINDER_LIMIT_MS = 15 * 1000; // 20 seconds
const CHECK_INTERVAL_SEC = 15;       // OS minimum is respected, this is a hint

// ----------------------------------------------------
// NOTIFICATION CONFIG (foreground support)
// ----------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ----------------------------------------------------
// BACKGROUND TASK (MUST be outside component)
// ----------------------------------------------------
TaskManager.defineTask(TRACKER_TASK_NAME, async () => {
  try {
    console.log(`⏱️ [BG Task] Executed at ${new Date().toLocaleTimeString()}`);

    const startTimeString = await SecureStore.getItemAsync(START_TIME_KEY);

    if (!startTimeString) {
      console.log('[BG Task] No start time found, unregistering.');
      await BackgroundFetch.unregisterTaskAsync(TRACKER_TASK_NAME);
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const startTime = parseInt(startTimeString, 10);
    const elapsedMs = Date.now() - startTime;

    console.log(`[BG Task] Elapsed: ${(elapsedMs / 1000).toFixed(0)}s`);

    if (elapsedMs >= REMINDER_LIMIT_MS) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '⏱️ Time Limit Reached!',
          body: `Session exceeded ${REMINDER_LIMIT_MS / 1000} seconds.`,
          sound: true,
        },
        trigger: null,
      });

      await SecureStore.deleteItemAsync(START_TIME_KEY);
      await BackgroundFetch.unregisterTaskAsync(TRACKER_TASK_NAME);

      console.log('[BG Task] Reminder sent, task stopped.');
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('[BG Task] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// ----------------------------------------------------
// COMPONENT
// ----------------------------------------------------
export default function TimestampTracker() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // ----------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------
  const refreshStatus = async () => {
    const registered = await TaskManager.isTaskRegisteredAsync(
      TRACKER_TASK_NAME
    );
    const storedStart = await SecureStore.getItemAsync(START_TIME_KEY);

    setIsRegistered(registered);
    setStartTime(storedStart ? new Date(parseInt(storedStart, 10)) : null);

    return registered;
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const bgStatus = await BackgroundFetch.getStatusAsync();

    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Enable notifications.');
      return false;
    }

    if (bgStatus !== BackgroundFetch.BackgroundFetchStatus.Available) {
      Alert.alert(
        'Unavailable',
        'Background fetch not available on this device.'
      );
      return false;
    }

    return true;
  };

  // ----------------------------------------------------
  // LIFECYCLE
  // ----------------------------------------------------
  useEffect(() => {
    refreshStatus();
  }, []);

  // ----------------------------------------------------
  // START / STOP
  // ----------------------------------------------------
  const handleToggleTask = async () => {
    const running = await refreshStatus();

    if (running) {
      // STOP
      await BackgroundFetch.unregisterTaskAsync(TRACKER_TASK_NAME);
      await SecureStore.deleteItemAsync(START_TIME_KEY);
      Alert.alert('Stopped', 'Session tracking stopped.');
    } else {
      // START
      if (!(await requestPermissions())) return;

      const now = Date.now();
      await SecureStore.setItemAsync(START_TIME_KEY, now.toString());

      await BackgroundFetch.registerTaskAsync(TRACKER_TASK_NAME, {
        minimumInterval: CHECK_INTERVAL_SEC,
        stopOnTerminate: false,
        startOnBoot: true,
      });

      Alert.alert(
        'Started',
        `Tracking started. Reminder in ~${REMINDER_LIMIT_MS / 1000}s`
      );
    }

    await refreshStatus();
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timestamp Tracker</Text>

      <Text style={styles.label}>Status</Text>
      <Text
        style={[
          styles.status,
          { color: isRegistered ? 'green' : 'red' },
        ]}
      >
        {isRegistered ? 'Tracking Active' : 'Idle'}
      </Text>

      {startTime && (
        <Text style={styles.startTime}>
          Started at: {startTime.toLocaleTimeString()}
        </Text>
      )}

      <Button
        title={isRegistered ? 'STOP Session' : 'START Session'}
        onPress={handleToggleTask}
        color={isRegistered ? '#ff4757' : '#2ecc71'}
      />

      {/* <View style={styles.notes}>
        <Text style={styles.noteTitle}>Testing Notes</Text>
        <Text style={styles.note}>• Limit: 20 seconds</Text>
        <Text style={styles.note}>• Check: ~15 seconds</Text>
        <Text style={styles.note}>
          • Background fetch timing is OS-controlled
        </Text>
      </View> */}
    </View>
  );
}

// ----------------------------------------------------
// STYLES
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  startTime: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  notes: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  note: {
    fontSize: 12,
    color: '#666',
  },
});
