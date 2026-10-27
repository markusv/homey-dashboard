import { getHomey } from "../homeyClient.js";
import {
  DOORBELL_DEVICE_ID,
  DOORBELL_DING_TRIGGER_ID,
  DOORBELL_FLOW_NAME,
  getDoorbellCaptureUrl,
} from "./doorbell.constants.js";

const buildFlow = () => ({
  name: DOORBELL_FLOW_NAME,
  enabled: true,
  trigger: {
    id: DOORBELL_DING_TRIGGER_ID,
    uri: `homey:device:${DOORBELL_DEVICE_ID}`,
    args: {},
  },
  conditions: [],
  actions: [
    {
      id: "homey:manager:logic:http",
      args: {
        method: "post",
        url: getDoorbellCaptureUrl(),
        headers: "",
        body: "",
      },
      group: "then",
      delay: null,
      duration: null,
    },
  ],
});

export const ensureDoorbellCaptureFlow = async () => {
  const homey = await getHomey();
  const flows = await homey.flow.getFlows();
  const existing = Object.values(flows).find(
    (flow) => flow.name === DOORBELL_FLOW_NAME
  );
  const flow = buildFlow();

  if (existing) {
    await homey.flow.updateFlow({ id: existing.id, flow });
    return existing.id;
  }

  const created = await homey.flow.createFlow({ flow });
  return created?.id ?? created;
};
