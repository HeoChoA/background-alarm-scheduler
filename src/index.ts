import AlarmSettings from './AlarmSettingsModule';
import { runTask } from './TaskRegistry';
import type { EventSubscription } from 'expo-modules-core';

export { defineTask } from './TaskRegistry';

/**
 * JS → Native: 작업 등록
 */
export async function registerTaskAsync(
  taskName: string,
  intervalMinutes: number,
  title?: string,
  body?: string
): Promise<void> {
  return AlarmSettings.registerTask(taskName, intervalMinutes, title, body);
}

/**
 * JS → Native: 작업 해제
 */
export async function unregisterTaskAsync(taskName: string): Promise<void> {
  return AlarmSettings.unregisterTask(taskName);
}

/**
 * Native → JS: onTaskExecute
 */
export function listenNativeEvents(): EventSubscription {
  return AlarmSettings.addListener('onTaskExecute', ({ taskName }) => {
    runTask(taskName);
  });
}
