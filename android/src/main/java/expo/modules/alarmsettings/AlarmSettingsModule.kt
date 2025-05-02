package expo.modules.alarmsettings

import android.util.Log
import androidx.work.*
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.TimeUnit

class AlarmSettingsModule : Module() {

    override fun definition() = ModuleDefinition {
        Name("AlarmSettings")
        // iOS와 맞추려면 굳이 이벤트 이름을 등록할 필요가 없어요 (안 쓸 거라면)
        // Events("alarmTriggered")  // <- 쓰지 않아도 됨

        Function("registerTask") { taskType: String, mode: String ->
            val context = appContext.reactContext?.applicationContext
            if (context == null) {
                Log.e(TAG, "Context is null - cannot schedule WorkManager.")
                return@Function
            }

            val inputData = Data.Builder()
                .putString("taskType", taskType)
                .build()

            val repeatInterval = when (mode) {
                "refresh" -> 15L
                "processing" -> 30L
                else -> 15L
            }

            val request = PeriodicWorkRequestBuilder<AlarmWorker>(repeatInterval, TimeUnit.MINUTES)
                .setInputData(inputData)
                .addTag(WORK_TAG)
                .build()

            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(WORK_NAME, ExistingPeriodicWorkPolicy.REPLACE, request)

            Log.d(TAG, "Scheduled taskType=$taskType mode=$mode (interval=$repeatInterval min)")
        }

        Function("cancelTask") {
            val context = appContext.reactContext?.applicationContext
            if (context == null) {
                Log.e(TAG, "Context is null - cannot cancel WorkManager.")
                return@Function "No context"
            }

            WorkManager.getInstance(context).cancelAllWorkByTag(WORK_TAG)
            Log.d(TAG, "Canceled all tasks with tag=$WORK_TAG")

            return@Function "OK"
        }
    }

    companion object {
        private const val TAG = "AlarmSettingsModule"
        private const val WORK_NAME = "AlarmSettingsWork"
        private const val WORK_TAG = "AlarmSettingsTag"
    }
}
