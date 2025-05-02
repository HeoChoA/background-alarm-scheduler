import { NativeModule, requireNativeModule } from 'expo';

import { AlarmSettingsModuleEvents } from './AlarmSettings.types';

declare class AlarmSettingsModule extends NativeModule<AlarmSettingsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AlarmSettingsModule>('AlarmSettings');
