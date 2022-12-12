export const updateCapabilityOnDevice = (device, capability, newValue) => {
  return {
    ...device,
    capabilitiesObj: {
      ...device.capabilitiesObj,
      [capability]: {
        ...device.capabilitiesObj[capability],
        value: newValue,
      },
    },
  };
};
