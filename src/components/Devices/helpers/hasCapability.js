export const hasCapability = (device, capabilityName) => {
  return Boolean(device?.capabilitiesObj?.[capabilityName]);
};
