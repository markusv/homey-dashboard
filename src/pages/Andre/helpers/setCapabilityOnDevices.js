import { getHomey } from "../../../helpers/getHomey";

export const setCapabilityOnDevices = async (devices, capabilityId, value) => {
  if (!devices?.length) return;
  const homeyApi = await getHomey();

  await Promise.allSettled(
    devices.map(async (device) => {
      try {
        await homeyApi.devices.setCapabilityValue({
          deviceId: device.id,
          capabilityId,
          value,
        });
      } catch {
        // Homey/Zigbee often rejects transient commands; avoid spamming the console.
      }
    })
  );
};
