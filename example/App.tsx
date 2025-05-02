import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import {
  registerTask,
  cancelTask,
  onAlarmTriggered,
  AlarmTaskMode,
} from "../src";

export default function App() {
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    const subscription = onAlarmTriggered((event) => {
      const log = `[${event.source}] Triggered: ${event.type}`;
      setEventLog((prev) => [log, ...prev]);
      console.log("🟡 JS Event received:", event);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRegister = (mode: AlarmTaskMode) => {
    console.log(mode);
    // JS에서 Swift로 작업 이름 및 모드 전달
    console.log("1");
    registerTask("printHello", mode);
    console.log("2");
    Alert.alert("Task Registered", `Mode: ${mode}`);
    console.log("3");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alarm Scheduler Module Test</Text>

      <View style={styles.buttons}>
        <Button
          title="Register Refresh Task"
          onPress={() => handleRegister("refresh")}
        />
        <Button
          title="Register Processing Task"
          onPress={() => handleRegister("processing")}
        />
        <Button title="Cancel Task" color="red" onPress={cancelTask} />
      </View>

      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Triggered Events:</Text>
        {eventLog.length === 0 ? (
          <Text style={styles.empty}>No events yet.</Text>
        ) : (
          eventLog.map((log, idx) => <Text key={idx}>- {log}</Text>)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  buttons: { gap: 12, marginBottom: 30 },
  logBox: { backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 },
  logTitle: { fontWeight: "bold", marginBottom: 5 },
  empty: { color: "#999" },
});
