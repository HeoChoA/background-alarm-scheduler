import UIKit
import BackgroundTasks
import AlarmSettings

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    BGTaskScheduler.shared.register(
      forTaskWithIdentifier: "com.moduleproject.alarm.refresh",
      using: nil
    ) { task in
      let refreshTask = task as! BGAppRefreshTask
      AlarmSettingsModule().handleAppRefresh(task: refreshTask)
    }

    BGTaskScheduler.shared.register(
      forTaskWithIdentifier: "com.moduleproject.alarm.processing",
      using: nil
    ) { task in
      let processingTask = task as! BGProcessingTask
      AlarmSettingsModule().handleProcessing(task: processingTask)
    }

    return true
  }
}