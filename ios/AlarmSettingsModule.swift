import ExpoModulesCore
import BackgroundTasks
import UserNotifications

public class AlarmSettingsModule: Module {
  private static let refreshID = "expo.modules.alarmsettings.example.refresh"
  private static let processingID = "expo.modules.alarmsettings.example.processing"
  private static let expectedBundleID = "expo.modules.alarmsettings.example"
  private static var didRegister = false
  private static var taskTypes: [String: String] = [:]

  public func definition() -> ModuleDefinition {
    Name("AlarmSettings")

    Function("registerTask") { (type: String, mode: String) in
      print("start")
      print("Actual Bundle ID:", Bundle.main.bundleIdentifier ?? "nil")

      let identifier = (mode == "refresh")
        ? AlarmSettingsModule.refreshID
        : AlarmSettingsModule.processingID

      AlarmSettingsModule.taskTypes[identifier] = type

      if mode == "refresh" {
        AlarmSettingsModule.registerAppRefresh()
      } else if mode == "processing" {
        AlarmSettingsModule.registerProcessing()
      } else {
        print("Unknown mode: \(mode)")
      }
    }

    Function("cancelTask") {
      BGTaskScheduler.shared.cancelAllTaskRequests()
       print("All BGTasks cancelled")
    }
  }

  // MARK: - Safe Register from AppDelegate
  public static func safeRegisterOnce() {
    guard !didRegister else {
      print("Already registered BGTasks")
      return
    }
    registerBGTasks()
    didRegister = true
  }

  // MARK: - Registration

  private static func registerBGTasks() {
    guard let actualBundleID = Bundle.main.bundleIdentifier,
          actualBundleID == expectedBundleID else {
      print("Bundle ID mismatch: \(Bundle.main.bundleIdentifier ?? "nil")")
      return
    }

    do {
      try BGTaskScheduler.shared.register(forTaskWithIdentifier: refreshID, using: nil) { task in
        guard let refreshTask = task as? BGAppRefreshTask else { return }
        handleAppRefresh(task: refreshTask)
      }

      try BGTaskScheduler.shared.register(forTaskWithIdentifier: processingID, using: nil) { task in
        guard let processingTask = task as? BGProcessingTask else { return }
        handleProcessing(task: processingTask)
      }

      print("BGTaskScheduler registration completed")
    } catch {
      print("BGTask registration failed: \(error)")
    }
  }

  // MARK: - Execution

  private static func runTask(for identifier: String) {
    guard let type = taskTypes[identifier] else {
      print("No task type for identifier: \(identifier)")
      return
    }

    switch type {
    case "printHello":
      print("Hello from BGTask")
    case "logTime":
      print("Time Log: \(Date())")
    default:
      print("Unknown task type: \(type)")
    }
  }

  public static func handleAppRefresh(task: BGAppRefreshTask) {
    print("BGAppRefreshTask triggered")
    task.expirationHandler = { print("AppRefresh expired") }
    runTask(for: refreshID)
    task.setTaskCompleted(success: true)
    registerAppRefresh()
  }

  public static func handleProcessing(task: BGProcessingTask) {
    print("BGProcessingTask triggered")
    task.expirationHandler = { print("Processing expired") }
    runTask(for: processingID)
    task.setTaskCompleted(success: true)
    registerProcessing()
  }

  private static func registerAppRefresh() {
    let request = BGAppRefreshTaskRequest(identifier: refreshID)
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60)
    do {
      try BGTaskScheduler.shared.submit(request)
      print("AppRefresh task submitted")
    } catch {
      print("Failed to submit refresh: \(error)")
    }
  }

  private static func registerProcessing() {
    let request = BGProcessingTaskRequest(identifier: processingID)
    request.earliestBeginDate = Date(timeIntervalSinceNow: 30 * 60)
    request.requiresNetworkConnectivity = false
    request.requiresExternalPower = false
    do {
      try BGTaskScheduler.shared.submit(request)
      print("Processing task submitted")
    } catch {
      print("Failed to submit processing: \(error)")
    }
  }
}

@objc public class AlarmSettingsModuleRegistrar: NSObject {
  @objc public static func register() {
    AlarmSettingsModule.safeRegisterOnce()
  }
}