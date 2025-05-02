package expo.modules.alarmsettings

import android.content.Context
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import java.text.SimpleDateFormat
import java.util.*

class AlarmWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val taskType = inputData.getString("taskType") ?: "unknown"
        Log.d(TAG, "AlarmWorker.doWork - taskType=$taskType")

        when (taskType) {
            "printHello" -> printHello()
            "logTime" -> logTime()
            else -> Log.d(TAG, "Unknown taskType=$taskType")
        }

        // 굳이 JS 이벤트를 보내지 않아도
        // - 앱이 죽어있을 수 있고,
        // - ReactApplication 참조가 안 될 수도 있고,
        // - expo.modules.kotlin.KotlinInteropModuleRegistryProvider도 없음
        return Result.success()
    }

    private fun printHello() {
        Log.d(TAG, "Hello from WorkManger Task on Android!")
        NotificationUtils.showNotification(
            applicationContext,
            "AlarmSettings",
            "Hello from WorkManager Task on Android!"
        )
    }

    private fun logTime() {
        val now = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
        Log.d(TAG, "logTime: $now")
        NotificationUtils.showNotification(
            applicationContext,
            "Time Check",
            "It's $now"
        )
    }

    companion object {
        private const val TAG = "AlarmWorker"
    }
}
