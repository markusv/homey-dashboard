import { getHomey } from "../../../helpers/getHomey";

export const setCapabilityOnDevices = async (devices, capabilityId, value) => {
  if (!devices?.length) return;
  const homeyApi = await getHomey();
  await Promise.allSettled(
    devices.map((device) =>
      homeyApi.devices.setCapabilityValue({
        deviceId: device.id,
        capabilityId,
        value,
      })
    )
  );
};
