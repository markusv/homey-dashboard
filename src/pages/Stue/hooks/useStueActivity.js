import { useEffect, useRef, useState } from "react";
import { ROBOROCK_LIVE_CAPABILITY_IDS } from "../../../components/Devices/Roborock/constants";
import { isRoborockRunning } from "../../../components/Devices/Roborock/helpers/getRoborockVisualState";
import { SONOS_KITCHEN_ID } from "../../../components/Devices/Sonos/Sonos";
import { ROBOROCK_STUE_DEVICE_ID } from "../../../constants";
import { pickStueActivity } from "../helpers/pickStueActivity";

const SPEAKER_PLAYING_CAPABILITY_IDS = ["speaker_playing"];

const useLiveCapabilityValues = (device, capabilityIds) => {
  const [values, setValues] = useState();
  const homeyDeviceRef = useRef(null);
  if (typeof device?.makeCapabilityInstance === "function") {
    homeyDeviceRef.current = device;
  }

  useEffect(() => {
    const homeyDevice = homeyDeviceRef.current;
    if (!homeyDevice) return undefined;

    const initial = {};
    capabilityIds.forEach((capabilityId) => {
      initial[capabilityId] =
        homeyDevice.capabilitiesObj?.[capabilityId]?.value;
    });
    setValues(initial);

    const instances = capabilityIds
      .filter((capabilityId) =>
        homeyDevice.capabilities?.includes(capabilityId)
      )
      .map((capabilityId) =>
        homeyDevice.makeCapabilityInstance(capabilityId, (newValue) => {
          setValues((current) => ({ ...current, [capabilityId]: newValue }));
        })
      );

    return () => {
      instances.forEach((instance) => {
        if (typeof instance?.destroy === "function") instance.destroy();
      });
    };
  }, [device?.id, capabilityIds]);

  return values;
};

const asDevice = (values) => {
  if (!values) return undefined;
  return {
    capabilitiesObj: Object.fromEntries(
      Object.entries(values).map(([id, value]) => [id, { value }])
    ),
  };
};

const stamp = (active, previous) => {
  if (!active) return 0;
  return previous || Date.now();
};

/**
 * Live owner of the Stue focus panel: the Roborock while it is driving,
 * or the kitchen speaker while it is playing. The later start wins.
 */
export const useStueActivity = (devices) => {
  const list = Array.isArray(devices) ? devices : Object.values(devices || {});
  const robot = list.find((device) => device?.id === ROBOROCK_STUE_DEVICE_ID);
  const kitchen = list.find((device) => device?.id === SONOS_KITCHEN_ID);
  const robotValues = useLiveCapabilityValues(
    robot,
    ROBOROCK_LIVE_CAPABILITY_IDS
  );
  const speakerValues = useLiveCapabilityValues(
    kitchen,
    SPEAKER_PLAYING_CAPABILITY_IDS
  );
  const robotRunning = isRoborockRunning(asDevice(robotValues));
  const speakerPlaying = speakerValues?.speaker_playing === true;
  const startedAtRef = useRef({ roborock: 0, kitchen: 0 });
  startedAtRef.current = {
    roborock: stamp(robotRunning, startedAtRef.current.roborock),
    kitchen: stamp(speakerPlaying, startedAtRef.current.kitchen),
  };

  return pickStueActivity({
    robotRunning,
    speakerPlaying,
    startedAt: startedAtRef.current,
  });
};
