import { requireNativeModule, EventSubscription } from "expo-modules-core";

export type AlarmTriggered = {
  type: string;
  source: "refresh" | "processing";
};

interface AlarmSettingsNativeModule {
  registerTask: (type: string, mode: AlarmTaskMode) => void;
  cancelTask: () => void;
  addListener: (
    eventName: "alarmTriggered",
    listener: (event: AlarmTriggered) => void
  ) => EventSubscription;
  removeListeners: (count: number) => void;
}
export type AlarmTaskMode = "refresh" | "processing";

export default requireNativeModule<AlarmSettingsNativeModule>("AlarmSettings");
