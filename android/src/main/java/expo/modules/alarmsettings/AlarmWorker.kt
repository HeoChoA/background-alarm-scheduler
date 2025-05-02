package expo.modules.alarmsettings

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat.getSystemService
import androidx.work.Worker
import androidx.work.WorkerParameters

class AlarmWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val taskName = inputData.getString("taskName") ?: "unknown"

        // 새로 추가된 title/body
        val title = inputData.getString("title") ?: "Alarm Triggered"
        val body = inputData.getString("body") ?: "Task: $taskName"

        Log.d(TAG, "AlarmWorker doWork() - taskName=$taskName, title=$title, body=$body")

        showNotification(taskName, title, body)

        // JS 이벤트 전송
        AlarmSettingsModule.instance?.sendOnTaskExecuteEvent(taskName)
        return Result.success()
    }

    private fun showNotification(taskName: String, title: String, body: String) {
        val CHANNEL_ID = "ALARM_SETTINGS_CHANNEL"
        val notificationManager = getSystemService(
            applicationContext,
            NotificationManager::class.java
        )

        val builder = NotificationCompat.Builder(applicationContext, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "AlarmSettings Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            notificationManager?.createNotificationChannel(channel)
        }

        notificationManager?.notify(taskName.hashCode(), builder.build())
    }

    companion object {
        private const val TAG = "AlarmWorker"
    }
}
