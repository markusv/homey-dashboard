import { RING_DEVICE_ID } from "../../constants.js";

export const DOORBELL_DEVICE_ID = RING_DEVICE_ID;

export const DOORBELL_FLOW_NAME = "Ringeklokke: lagre snapshot";

export const getDoorbellCaptureUrl = () =>
  process.env.DOORBELL_CAPTURE_URL ||
  "http://192.168.68.91/api/read/doorbell/capture";

export const DOORBELL_DING_TRIGGER_ID = `homey:device:${DOORBELL_DEVICE_ID}:ding`;
