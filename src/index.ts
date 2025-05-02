import AlarmSettingsModule, { AlarmTaskMode } from "./AlarmSettingsModule";

export function registerTask(type: string, mode: AlarmTaskMode): void {
  AlarmSettingsModule.registerTask(type, mode);
  console.log(`Registered task: ${type} with mode ${mode}`);
}

export function cancelTask(): void {
  AlarmSettingsModule.cancelTask();
  console.log("Canceled all tasks");
}