import React from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { useActionLock } from "../helpers/useActionLock";
import { getHomey } from "../../../helpers/getHomey";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { IconButton } from "./IconButton";

export const FlowsSection = ({ flows = [], vacuumDeviceId, lightState }) => {
  const hasFlows = flows.length > 0;
  const hasVacuum = Boolean(vacuumDeviceId);
  const hasLights = Boolean(lightState?.lights?.length);
  if (!hasFlows && !hasVacuum && !hasLights) return null;

  return (
    <section className="andre-section">
      <h2 className="andre-section-title">Handlinger</h2>
      <div className="andre-flows">
        {hasLights && <LightToggleButton lightState={lightState} />}
        {flows.map((flow) => (
          <FlowButton key={flow.id} flow={flow} />
        ))}
        {hasVacuum && <VacuumStartButton deviceId={vacuumDeviceId} />}
      </div>
    </section>
  );
};

const LightToggleButton = ({ lightState }) => {
  const { on, color, pending, toggleLights } = lightState;
  const activeStyle = on && color ? { color } : undefined;

  return (
    <IconButton
      icon="lightbulb"
      label={on ? "Slå av lys" : "Slå på lys"}
      active={on}
      pending={pending}
      onClick={toggleLights}
      style={activeStyle}
      className={
        on
          ? "andre-icon-button--lit andre-icon-button--xl"
          : "andre-icon-button--xl"
      }
    />
  );
};

const FlowButton = ({ flow }) => {
  const [run, pending] = useActionLock();
  return (
    <SlButton
      size="large"
      className="andre-flow-button"
      loading={pending}
      onClick={() => run(() => triggerFlow(flow.id))}
    >
      <sl-icon slot="prefix" name={flow.icon || "stars"} />
      {flow.label}
    </SlButton>
  );
};

const VacuumStartButton = ({ deviceId }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "is_cleaning");
  const [run, pending] = useActionLock();
  const isCleaning = device?.capabilitiesObj?.is_cleaning?.value === true;

  return (
    <SlButton
      size="large"
      className="andre-flow-button"
      loading={pending}
      variant={isCleaning ? "primary" : "default"}
      onClick={() =>
        run(async () => {
          if (!device?.id) return;
          const homeyApi = await getHomey();
          if (device.capabilities?.includes("clean_full")) {
            await homeyApi.devices.setCapabilityValue({
              deviceId: device.id,
              capabilityId: "clean_full",
              value: true,
            });
            return;
          }
          if (device.capabilities?.includes("onoff")) {
            await homeyApi.devices.setCapabilityValue({
              deviceId: device.id,
              capabilityId: "onoff",
              value: true,
            });
          }
        })
      }
    >
      <sl-icon slot="prefix" name="robot" />
      {isCleaning ? "Støvsuger kjører" : "Start støvsuger"}
    </SlButton>
  );
};
