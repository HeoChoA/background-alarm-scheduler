import ExpoModulesCore
import BackgroundTasks
import UserNotifications

public class AlarmSettingsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("AlarmSettings")

    Events("alarmTriggered")

    Function("registerTask") { (type: String, mode: String) in
      AlarmSettingsModule.taskType = type
      if mode == "refresh" {
        AlarmSettingsModule.registerAppRefresh()
      } else if mode == "processing" {
        AlarmSettingsModule.registerProcessing()
      } else {
        print("Unknown mode")
      }
    }

    Function("cancelTask") {
      BGTaskScheduler.shared.cancelAllTaskRequests()
    }
  }

  // MARK: - BG Task Handlers

  public func handleAppRefresh(task: BGAppRefreshTask) {
    task.expirationHandler = { print("AppRefresh expired") }
    AlarmSettingsModule.runTask()

    sendEvent("alarmTriggered", [
      "type": AlarmSettingsModule.taskType ?? "unknown",
      "source": "refresh"
    ])

    task.setTaskCompleted(success: true)
    AlarmSettingsModule.registerAppRefresh()
  }

  public func handleProcessing(task: BGProcessingTask) {
    task.expirationHandler = { print("Processing expired") }
    AlarmSettingsModule.runTask()

    sendEvent("alarmTriggered", [
      "type": AlarmSettingsModule.taskType ?? "unknown",
      "source": "processing"
    ])

    task.setTaskCompleted(success: true)
    AlarmSettingsModule.registerProcessing()
  }

  // MARK: - Internal Task Logic

  private static var taskType: String?

  private static let taskHandlers: [String: () -> Void] = [
    "printHello": {
      print("Hello from BGTask")
    },
    "logTime": {
      print("Current Time: \(Date())")
      showLocalNotification(title: "Time Check", body: "It's \(Date())")
    }
  ]

  private static func runTask() {
    guard let type = taskType else {
      print("No task type set")
      return
    }
    if let handler = taskHandlers[type] {
      handler()
    } else {
      print("Unknown task type: \(type)")
    }
  }

  private static func registerAppRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: "com.moduleproject.alarm.refresh")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 60*15)
    //try? BGTaskScheduler.shared.submit(request)
    print("request",request);
    do {
        print("try")
        try BGTaskScheduler.shared.submit(request)
    } catch {
        print("BGTaskScheduler 등록 실패: \(error)")
      }
  }

  private static func registerProcessing() {
    let request = BGProcessingTaskRequest(identifier: "com.moduleproject.alarm.processing")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 60 * 30)
    request.requiresNetworkConnectivity = false
    request.requiresExternalPower = false
    //try? BGTaskScheduler.shared.submit(request)
     do {
        try BGTaskScheduler.shared.submit(request)
    } catch {
        print("BGTaskScheduler 등록 실패: \(error)")
      }
  }

  private static func showLocalNotification(title: String, body: String) {
    let center = UNUserNotificationCenter.current()
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.sound = .default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)

    center.add(request) { error in
      if let error = error {
        print("Notification error: \(error)")
      }
    }
  }
}
