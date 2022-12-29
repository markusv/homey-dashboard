import React from "react";

export const Icon = ({ homeyDevice }) => {
  if (!homeyDevice?.iconOverride && !homeyDevice?.iconObj) {
    return null;
  }

  const src = homeyDevice.iconOverride
    ? `https://my.homey.app/img/devices/${homeyDevice.iconOverride}.svg`
    : `https://icons-cdn.athom.com/${homeyDevice.iconObj.id}-128.png`;
  return (
    <div className="device-icon">
      {homeyDevice?.iconObj && <img className="device-icon-image" src={src} />}
    </div>
  );
};
