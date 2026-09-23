import { useEffect, useRef, useState } from "react";
import { getVolumeFromDevice } from "../helpers/getVolumeFromDevice";
import { useMakeCapabilityInstance } from "../../helpers/useMakeCapabilityInstance";
import { useDebounce } from "../../../../helpers/useDebounce";
import { getHomey } from "../../../../helpers/getHomey";

export const useVolume = (sonosKitchen) => {
  const [volume, setVolume] = useState(getVolumeFromDevice(sonosKitchen));

  useMakeCapabilityInstance(
    sonosKitchen,
    (newDevice) => {
      const newVolume =
        (newDevice?.capabilitiesObj?.["volume_set"]?.value ?? 0) * 100;
      setVolume(newVolume);
    },
    "volume_set"
  );

  const debouncedVolume = useDebounce(volume, 750);
  const deviceRef = useRef(sonosKitchen);
  const userAdjusted = useRef(false);
  deviceRef.current = sonosKitchen;

  useEffect(() => {
    const device = deviceRef.current;
    if (!device || !userAdjusted.current) return undefined;

    let cancelled = false;
    const writeVolume = async () => {
      try {
        const homeyApi = await getHomey();
        await homeyApi.devices.setCapabilityValue({
          deviceId: device.id,
          capabilityId: "volume_set",
          value: debouncedVolume / 100,
        });
      } catch {
        // Homey rejects the write when the speaker is offline.
      }
      if (cancelled) return;
    };
    writeVolume();
    return () => {
      cancelled = true;
    };
  }, [debouncedVolume]);

  return [
    volume,
    setVolume,
    (sliderEvent) => {
      sliderEvent.stopPropagation();
      userAdjusted.current = true;
      setVolume(sliderEvent.target.value);
    },
  ];
};
