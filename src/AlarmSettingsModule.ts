import { requireNativeModule, EventSubscription } from 'expo-modules-core';

interface AlarmSettingsNativeModule {
  // registerTask(taskName, intervalMinutes, title?, body?)
  registerTask(
    taskName: string,
    intervalMinutes: number,
    title?: string,
    body?: string
  ): Promise<void>;

  unregisterTask(taskName: string): Promise<void>;
  addListener(
    eventName: 'onTaskExecute',
    callback: (payload: { taskName: string }) => void
  ): EventSubscription;
  removeListeners(count: number): void;
}

const AlarmSettings = requireNativeModule<AlarmSettingsNativeModule>('AlarmSettings');
export default AlarmSettings;
