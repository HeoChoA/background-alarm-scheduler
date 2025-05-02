import ExpoModulesCore
import BackgroundTasks

public class AlarmSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AlarmSettings")
    Events("alarmTriggered")

    Function("registerTask") { (type: String, mode: String) in
      AlarmSchedulerExecutor.shared.taskType = type
      if mode == "refresh" {
        AlarmSchedulerExecutor.shared.registerAppRefresh()
      } else if mode == "processing" {
        AlarmSchedulerExecutor.shared.registerProcessing()
      }
    }

    Function("cancelTask") {
      AlarmSchedulerExecutor.shared.cancel()
    }
  }

  public func handleAppRefresh(task: BGAppRefreshTask) {
    task.expirationHandler = { print("AppRefresh expired") }
    AlarmSchedulerExecutor.shared.runTask()
    sendEvent("alarmTriggered", [
      "type": AlarmSchedulerExecutor.shared.taskType ?? "unknown",
      "source": "refresh"
    ])
    task.setTaskCompleted(success: true)
    AlarmSchedulerExecutor.shared.registerAppRefresh()
  }

  public func handleProcessing(task: BGProcessingTask) {
    task.expirationHandler = { print("Processing expired") }
    AlarmSchedulerExecutor.shared.runTask()
    sendEvent("alarmTriggered", [
      "type": AlarmSchedulerExecutor.shared.taskType ?? "unknown",
      "source": "processing"
    ])
    task.setTaskCompleted(success: true)
    AlarmSchedulerExecutor.shared.registerProcessing()
  }
}
