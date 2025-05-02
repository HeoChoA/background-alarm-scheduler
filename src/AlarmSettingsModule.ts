import { requireNativeModule } from "expo-modules-core";

const AlarmSettingsModule = requireNativeModule("AlarmSettings");

if (!AlarmSettingsModule) {
  throw new Error("Native module 'AlarmSettings' not found");
}

export type AlarmTaskMode = "refresh" | "processing";
export default AlarmSettingsModule;