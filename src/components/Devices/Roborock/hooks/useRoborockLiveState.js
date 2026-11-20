import { useEffect, useRef } from "react";
import { updateCapabilityOnDevice } from "../../helpers/updateCapabolityOnDevice";
import { ROBOROCK_LIVE_CAPABILITY_IDS } from "../constants";

/**
 * Subscribes once to the Homey device object. Later state copies are plain
 * objects without makeCapabilityInstance, so the original device is kept in a ref.
 */
export const useRoborockLiveState = (device, setDevice) => {
  const homeyDeviceRef = useRef(null);
  if (typeof device?.makeCapabilityInstance === "function") {
    homeyDeviceRef.current = device;
  }

  useEffect(() => {
    const homeyDevice = homeyDeviceRef.current;
    if (!homeyDevice) return undefined;

    const capabilities = ROBOROCK_LIVE_CAPABILITY_IDS.filter((capabilityId) =>
      homeyDevice.capabilities?.includes(capabilityId)
    );

    const instances = capabilities.map((capabilityId) =>
      homeyDevice.makeCapabilityInstance(capabilityId, (newValue) => {
        setDevice((current) => {
          if (!current) return current;
          return updateCapabilityOnDevice(current, capabilityId, newValue);
        });
      })
    );

    return () => {
      instances.forEach((instance) => {
        if (typeof instance?.destroy === "function") {
          instance.destroy();
        }
      });
    };
  }, [device?.id, setDevice]);
};
