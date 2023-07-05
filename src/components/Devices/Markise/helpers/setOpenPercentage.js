import { getHomey } from "../../../../helpers/getHomey";
import { MARKISE_UP_DOWN_CAPABILITY_ID } from "../constants";

export const setOpenPercentage = async (device, openPercentage) => {
  const homeyApi = await getHomey();
  homeyApi.devices
    .setCapabilityValue({
      deviceId: device.id,
      capabilityId: MARKISE_UP_DOWN_CAPABILITY_ID,
      value: openPercentage,
    })
    .catch(console.error);
};
