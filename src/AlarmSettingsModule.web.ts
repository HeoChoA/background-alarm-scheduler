import { registerWebModule, NativeModule } from 'expo';

import { AlarmSettingsModuleEvents } from './AlarmSettings.types';

class AlarmSettingsModule extends NativeModule<AlarmSettingsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(AlarmSettingsModule, 'AlarmSettingsModule');
