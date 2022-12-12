import { useEffect } from "react";
import { updateCapabilityOnDevice } from "./updateCapabolityOnDevice";

export const useMakeCapabilityInstance = (device, setDevice, capability) => {
  useEffect(() => {
    if (!device) return;
    device.makeCapabilityInstance(capability, (newValue) => {
      setDevice(updateCapabilityOnDevice(device, capability, newValue));
    });
  }, [device?.id]);
};
