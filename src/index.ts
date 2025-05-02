import AlarmSettingsModule, {
  AlarmTaskMode,
  AlarmTriggered,
} from "./AlarmSettingsModule";
import { EventSubscription } from "expo-modules-core";

export function registerTask(type: string, mode: AlarmTaskMode): void {
  AlarmSettingsModule.registerTask(type, mode);
  console.log(`✅Task registered: ${type} (${mode})`);
}

export function cancelTask(): void {
  return AlarmSettingsModule.cancelTask();
}

export function onAlarmTriggered(
  listener: (event: AlarmTriggered) => void
): EventSubscription {
  return AlarmSettingsModule.addListener("alarmTriggered", listener);
}

export type { AlarmTaskMode };
