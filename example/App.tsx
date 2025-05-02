import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  defineTask,
  registerTaskAsync,
  unregisterTaskAsync,
  listenNativeEvents,
} from 'alarm-settings';

export default function App() {
  useEffect(() => {
    defineTask('A Task', async () => {
      console.log('🔔 JS A Task');
    });
    defineTask('B Task', async () => {
      console.log('🔔 JS B Task');
    });

    const subscription = listenNativeEvents();
    return () => subscription.remove();
  }, []);

  const handleRegisterATask = async () => {
    // ✅ title, body 추가
    await registerTaskAsync('A Task', 20, 'Title: A Task', 'Body: A Task');
    console.log('Registered "A Task"');
  };

  const handleRegisterBTask = async () => {
    await registerTaskAsync('B Task', 15, 'Title: B Task', 'Body: B Task');
    console.log('Registered "B Task"');
  };

  const handleUnregisterATask = async () => {
    await unregisterTaskAsync('A Task');
    console.log('Unregistered "A Task"');
  };

  const handleUnregisterBTask = async () => {
    await unregisterTaskAsync('B Task');
    console.log('Unregistered "B Task"');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm Scheduler Module Test</Text>
      <Button title="Register A Task (20m)" onPress={handleRegisterATask} />
      <Button title="Register B Task (15m)" onPress={handleRegisterBTask} />
      <Button title="Unregister A Task" onPress={handleUnregisterATask} />
      <Button title="Unregister B Task" onPress={handleUnregisterBTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 60, padding: 20, flex: 1 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
});
