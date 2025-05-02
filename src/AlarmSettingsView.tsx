import { requireNativeView } from 'expo';
import * as React from 'react';

import { AlarmSettingsViewProps } from './AlarmSettings.types';

const NativeView: React.ComponentType<AlarmSettingsViewProps> =
  requireNativeView('AlarmSettings');

export default function AlarmSettingsView(props: AlarmSettingsViewProps) {
  return <NativeView {...props} />;
}
