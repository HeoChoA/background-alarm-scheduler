package expo.modules.alarmsettings

import android.util.Log
import androidx.work.*
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.TimeUnit

class AlarmSettingsModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("AlarmSettings")

        Events("onTaskExecute")

        // JS → Native: registerTask(taskName, intervalMinutes, title, body)
        Function("registerTask") { taskName: String, intervalMinutes: Int, title: String?, body: String? ->
            val context = appContext.reactContext?.applicationContext
            if (context == null) {
                Log.e(TAG, "Context is null - cannot schedule WorkManager.")
                return@Function
            }

            val finalInterval = if (intervalMinutes < 15) 15 else intervalMinutes

            // title, body도 함께 담아 전달
            val inputData = Data.Builder()
                .putString("taskName", taskName)
                .putString("title", title)
                .putString("body", body)
                .build()

            val request = PeriodicWorkRequestBuilder<AlarmWorker>(
                finalInterval.toLong(), TimeUnit.MINUTES
            )
                .setInputData(inputData)
                .addTag(taskName)
                .build()

            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(taskName, ExistingPeriodicWorkPolicy.REPLACE, request)

            Log.d(TAG, "registerTask → taskName=$taskName, interval=$finalInterval, title=$title, body=$body")
        }

        // JS → Native: unregisterTask(taskName)
        Function("unregisterTask") { taskName: String ->
            val context = appContext.reactContext?.applicationContext
            if (context == null) {
                Log.e(TAG, "Context is null - cannot cancel WorkManager.")
                return@Function
            }

            WorkManager.getInstance(context).cancelUniqueWork(taskName)
            Log.d(TAG, "unregisterTask → canceled $taskName")
        }
    }

    fun sendOnTaskExecuteEvent(taskName: String) {
        sendEvent("onTaskExecute", mapOf("taskName" to taskName))
        Log.d(TAG, "sendOnTaskExecuteEvent → Dispatched to JS (taskName=$taskName)")
    }

    companion object {
        private const val TAG = "AlarmSettingsModule"
        var instance: AlarmSettingsModule? = null
            private set
    }

    init {
        instance = this
    }
}
