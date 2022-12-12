import React from 'react';
import { Device } from './Device'

export const Devices = ({deviceIds}) => {
  if(!deviceIds || deviceIds.length === 0) {
    return null;
  }
  return <section>
    <h1>Devices</h1>
    <div className="devices">
      {deviceIds.map(deviceId => {
        return (
          <Device key={deviceId} deviceId={deviceId} />
        );
      })}
    </div>
  </section>
}