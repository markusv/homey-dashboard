import { useMakeCapabilityInstance } from "../helpers/useMakeCapabilityInstance";
import {
  ROBOROCK_ONOFF_CAPABILITY_ID,
  ROBOROCK_STATE_CAPABILITY_ID,
} from "./constants";
import { getHomey } from "../../../helpers/getHomey";

export const useToggleRoborockClean = (roborockDevice, setRoborockDevice) => {
  useMakeCapabilityInstance(
    roborockDevice,
    setRoborockDevice,
    ROBOROCK_ONOFF_CAPABILITY_ID
  );
  useMakeCapabilityInstance(
    roborockDevice,
    setRoborockDevice,
    ROBOROCK_STATE_CAPABILITY_ID
  );

  const onToggleRoborockClean = async () => {
    const homeyApi = await getHomey();
    const currentValue =
      roborockDevice?.capabilitiesObj?.[ROBOROCK_ONOFF_CAPABILITY_ID]?.value ??
      false;
    const newValue = !currentValue;
    homeyApi.devices
      .setCapabilityValue({
        deviceId: roborockDevice.id,
        capabilityId: ROBOROCK_ONOFF_CAPABILITY_ID,
        value: newValue,
      })
      .catch(console.error);

    if (!newValue) {
      homeyApi.devices
        .setCapabilityValue({
          deviceId: roborockDevice.id,
          capabilityId: ROBOROCK_STATE_CAPABILITY_ID,
          value: "docked",
        })
        .catch(console.error);
    }
  };
  return onToggleRoborockClean;
};
