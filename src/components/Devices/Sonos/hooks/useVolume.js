import { useEffect, useState } from "react";
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
  useEffect(() => {
    const setV = async () => {
      const homeyApi = await getHomey();
      homeyApi.devices.setCapabilityValue({
        deviceId: sonosKitchen.id,
        capabilityId: "volume_set",
        value: debouncedVolume / 100,
      });
    };
    setV();
  }, [debouncedVolume]);

  return [
    volume,
    setVolume,
    (sliderEvent) => {
      sliderEvent.stopPropagation();
      sliderEvent.preventDefault();
      setVolume(sliderEvent.target.value);
    },
  ];
};
