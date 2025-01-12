export const getVolumeFromDevice = (d) =>
  (d?.capabilitiesObj?.["volume_set"]?.value ?? 0) * 100;
