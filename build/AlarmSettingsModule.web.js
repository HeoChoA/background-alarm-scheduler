import { registerWebModule, NativeModule } from 'expo';
class AlarmSettingsModule extends NativeModule {
    PI = Math.PI;
    async setValueAsync(value) {
        this.emit('onChange', { value });
    }
    hello() {
        return 'Hello world! 👋';
    }
}
export default registerWebModule(AlarmSettingsModule, 'AlarmSettingsModule');
//# sourceMappingURL=AlarmSettingsModule.web.js.map