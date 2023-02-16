import React from "react";

export const SvgIcon = ({ url, className }) => (
  <div className={`${className} device-icon`}>
    <img className="device-icon-image" src={url} />
  </div>
);
