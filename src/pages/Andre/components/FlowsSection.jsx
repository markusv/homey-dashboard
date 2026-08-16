import React from "react";
import classNames from "classnames";
import { triggerFlow } from "../../../components/Flows/helpers/triggerFlow";
import { useActionLock } from "../helpers/useActionLock";
import { getHomey } from "../../../helpers/getHomey";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { useMakeCapabilityInstance } from "../../../components/Devices/helpers/useMakeCapabilityInstance";
import { BlindIcon } from "./BlindIcon";

export const FlowsSection = ({
  flows = [],
  vacuumDeviceId,
  lightState,
  blindState,
}) => {
  const hasFlows = flows.length > 0;
  const hasVacuum = Boolean(vacuumDeviceId);
  const hasLights = Boolean(lightState?.lights?.length);
  const hasBlinds = Boolean(blindState?.blinds?.length);
  if (!hasFlows && !hasVacuum && !hasLights && !hasBlinds) return null;

  return (
    <section className="andre-section">
      <h2 className="andre-section-title">Handlinger</h2>
      <div className="andre-flows">
        {hasLights && <LightToggleButton lightState={lightState} />}
        {hasBlinds && <BlindButtons blindState={blindState} />}
        {flows.map((flow) => (
          <FlowButton key={flow.id} flow={flow} />
        ))}
        {hasVacuum && <VacuumStartButton deviceId={vacuumDeviceId} />}
      </div>
    </section>
  );
};

const SceneButton = ({
  icon,
  iconNode,
  label,
  onClick,
  pending = false,
  active = false,
  accent = null,
  ariaPressed,
}) => (
  <button
    type="button"
    className={classNames("andre-scene-button", {
      "andre-scene-button--pending": pending,
      "andre-scene-button--active": active,
      [`andre-scene-button--${accent}`]: Boolean(accent),
    })}
    aria-label={label}
    aria-pressed={ariaPressed}
    disabled={pending}
    onClick={(event) => {
      onClick?.(event);
      event.currentTarget.blur();
    }}
  >
    {iconNode ?? <sl-icon name={icon} />}
    <span className="andre-scene-button-label">{label}</span>
  </button>
);

const LightToggleButton = ({ lightState }) => {
  const { on, pending, toggleLights } = lightState;

  return (
    <button
      type="button"
      className={classNames("andre-scene-button", {
        "andre-scene-button--on": on,
        "andre-scene-button--off": !on,
        "andre-scene-button--pending": pending,
      })}
      aria-label={on ? "Slå av lys" : "Slå på lys"}
      aria-pressed={on}
      disabled={pending}
      onClick={toggleLights}
    >
      <sl-icon name="lightbulb" />
      <span className="andre-scene-button-label">
        {on ? "Lys på" : "Lys av"}
      </span>
    </button>
  );
};

const BlindButtons = ({ blindState }) => {
  const { pending, raiseBlinds, lowerBlinds } = blindState;

  return (
    <>
      <SceneButton
        iconNode={<BlindIcon direction="up" className="andre-blind-icon" />}
        label="Gardin opp"
        pending={pending}
        onClick={raiseBlinds}
      />
      <SceneButton
        iconNode={<BlindIcon direction="down" className="andre-blind-icon" />}
        label="Gardin ned"
        pending={pending}
        onClick={lowerBlinds}
      />
    </>
  );
};

const BLIND_FLOW_ICONS = new Set([
  "sun-shades",
  "blinds",
  "rullegardin",
  "gardin",
  "solskjerming",
]);

const FlowButton = ({ flow }) => {
  const [run, pending] = useActionLock();
  const iconName = flow.icon || "stars";
  const useBlindIcon = BLIND_FLOW_ICONS.has(iconName);

  return (
    <SceneButton
      icon={useBlindIcon ? undefined : iconName}
      iconNode={
        useBlindIcon ? <BlindIcon className="andre-blind-icon" /> : undefined
      }
      label={flow.label || "Handling"}
      pending={pending}
      onClick={() => run(() => triggerFlow(flow.id))}
    />
  );
};

const VacuumStartButton = ({ deviceId }) => {
  const [device, setDevice] = useGetDevice(deviceId);
  useMakeCapabilityInstance(device, setDevice, "is_cleaning");
  const [run, pending] = useActionLock();
  const isCleaning = device?.capabilitiesObj?.is_cleaning?.value === true;

  return (
    <SceneButton
      icon="robot"
      label={isCleaning ? "Støvsuger kjører" : "Start støvsuger"}
      pending={pending}
      active={isCleaning}
      accent="vacuum"
      ariaPressed={isCleaning}
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
    />
  );
};
