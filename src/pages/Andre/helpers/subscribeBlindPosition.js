import { WINDOWCOVERINGS_SET } from "./getRoomBlinds";
import { subscribeDeviceCapability } from "./subscribeDeviceCapability";

/** @deprecated Prefer subscribeDeviceCapability — kept for clear blinds call sites. */
export const subscribeBlindPosition = (device, onValue) =>
  subscribeDeviceCapability(device, WINDOWCOVERINGS_SET, onValue);
