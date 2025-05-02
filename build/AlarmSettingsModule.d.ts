import { NativeModule } from 'expo';
import { AlarmSettingsModuleEvents } from './AlarmSettings.types';
declare class AlarmSettingsModule extends NativeModule<AlarmSettingsModuleEvents> {
    PI: number;
    hello(): string;
    setValueAsync(value: string): Promise<void>;
}
declare const _default: AlarmSettingsModule;
export default _default;
//# sourceMappingURL=AlarmSettingsModule.d.ts.map