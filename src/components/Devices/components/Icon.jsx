import React from "react";

export const Icon = ({ homeyDevice }) => {
  return (
    <div className="device-icon">
      {homeyDevice?.iconObj && (
        <img
          className="device-icon-image"
          src={`https://icons-cdn.athom.com/${homeyDevice.iconObj.id}-128.png`}
        />
      )}
    </div>
  );
};
