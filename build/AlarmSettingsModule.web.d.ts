import { NativeModule } from 'expo';
import { AlarmSettingsModuleEvents } from './AlarmSettings.types';
declare class AlarmSettingsModule extends NativeModule<AlarmSettingsModuleEvents> {
    PI: number;
    setValueAsync(value: string): Promise<void>;
    hello(): string;
}
declare const _default: typeof AlarmSettingsModule;
export default _default;
//# sourceMappingURL=AlarmSettingsModule.web.d.ts.map