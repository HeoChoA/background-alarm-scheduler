// alarm-settings/src/TaskRegistry.ts

export type TaskCallback = () => Promise<void> | void;

// taskName(key) → callback(value) 매핑
const taskMap = new Map<string, TaskCallback>();

/**
 * JS에서 실행할 Task 함수를 taskName과 함께 등록
 */
export function defineTask(taskName: string, callback: TaskCallback): void {
  taskMap.set(taskName, callback);
}

/**
 * 네이티브에서 `taskName`이 넘어왔을 때 해당 콜백을 실행
 */
export function runTask(taskName: string): void {
  const taskFn = taskMap.get(taskName);
  if (!taskFn) {
    console.warn(`[AlarmScheduler] No task defined for "${taskName}"`);
    return;
  }

  // callback 실행 (Promise면 에러 캐치)
  try {
    const result = taskFn();
    if (result instanceof Promise) {
      result.catch((err) =>
        console.error(`[AlarmScheduler] Task "${taskName}" failed:`, err)
      );
    }
  } catch (err) {
    console.error(`[AlarmScheduler] Task "${taskName}" error:`, err);
  }
}
