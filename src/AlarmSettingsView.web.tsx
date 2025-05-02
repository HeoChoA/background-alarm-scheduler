import * as React from 'react';

import { AlarmSettingsViewProps } from './AlarmSettings.types';

export default function AlarmSettingsView(props: AlarmSettingsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
