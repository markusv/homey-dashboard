import React, { useEffect } from "react";
import { useGetDevice } from "./helpers/useGetDevice";
import { getHomey } from "../../helpers/getHomey";
import classnames from "classnames";
import "./device.css";
import { hasCapability } from "./helpers/hasCapability";
import { Temperature } from "./components/Temperature";
import { Icon } from "./components/Icon";
import { updateCapabilityOnDevice } from "./helpers/updateCapabolityOnDevice";

const getCapabilityToToggleOnClick = (device) => {
  const capability = device.ui?.quickAction ? device.ui?.quickAction : "onoff";
  if (device.capabilitiesObj[capability]) {
    return capability;
  }
  return undefined;
};

export const Device = ({ deviceId }) => {
  const [homeyDevice, setHomeyDevice] = useGetDevice(deviceId);

  useEffect(() => {
    if (!homeyDevice) return;
    const onClickCapability = getCapabilityToToggleOnClick(homeyDevice);
    if (!onClickCapability) return;
    homeyDevice.makeCapabilityInstance(onClickCapability, (newValue) => {
      setHomeyDevice(
        updateCapabilityOnDevice(homeyDevice, onClickCapability, newValue)
      );
    });
    if (hasCapability(homeyDevice, "measure_temperature")) {
      homeyDevice.makeCapabilityInstance("measure_temperature", (newValue) => {
        setHomeyDevice(
          updateCapabilityOnDevice(homeyDevice, "measure_temperature", newValue)
        );
      });
    }
  }, [homeyDevice?.id]);

  const onDeviceClick = async () => {
    const homeyApi = await getHomey();
    const onClickCapability = getCapabilityToToggleOnClick(homeyDevice);
    if (!onClickCapability) return;
    const newValue = !homeyDevice.capabilitiesObj[onClickCapability]?.value;
    homeyApi.devices
      .setCapabilityValue({
        deviceId: homeyDevice.id,
        capabilityId: onClickCapability,
        value: newValue,
      })
      .catch(console.error);
    setHomeyDevice(
      updateCapabilityOnDevice(homeyDevice, onClickCapability, newValue)
    );
  };

  if (!homeyDevice) {
    return null;
  }

  const classes = classnames("device", {
    "device--active": homeyDevice.capabilitiesObj?.onoff?.value,
  });
  const hasTemperature = hasCapability(homeyDevice, "measure_temperature");
  if (hasTemperature) {
    console.log("homeyDevice", homeyDevice);
  }
  return (
    <div onClick={onDeviceClick} className={`device ${classes}`}>
      {hasTemperature && <Temperature device={homeyDevice} />}
      <Icon homeyDevice={homeyDevice} />
      <div className="device-content">{homeyDevice.name}</div>
    </div>
  );
};
