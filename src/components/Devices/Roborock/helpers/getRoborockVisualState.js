import {
  ROBOROCK_BATTERY_CAPABILITY_ID,
  ROBOROCK_CHARGING_STATE_CAPABILITY_ID,
  ROBOROCK_CLEANING_CAPABILITY_ID,
  ROBOROCK_DOCK_CAPABILITY_ID,
  ROBOROCK_FULL_BATTERY,
  ROBOROCK_PAUSE_CAPABILITY_ID,
  ROBOROCK_SCENE,
} from "../constants";

const readValue = (device, capabilityId) =>
  device?.capabilitiesObj?.[capabilityId]?.value;

const readBattery = (device) => {
  const value = readValue(device, ROBOROCK_BATTERY_CAPABILITY_ID);
  const battery = typeof value === "number" ? value : Number(value);
  return Number.isFinite(battery) ? battery : null;
};

const sceneState = (scene, status, showDockButton) => ({
  scene,
  status,
  showDockButton,
});

/**
 * Maps the Functor Roborock device onto the focus scene.
 * Green rings only while the battery is still climbing. At 100% Homey
 * still reports battery_charging_state "charging", which is fully charged.
 */
export const getRoborockVisualState = (device) => {
  if (!device) {
    return sceneState(ROBOROCK_SCENE.DOCKED, "", false);
  }

  const cleaning = readValue(device, ROBOROCK_CLEANING_CAPABILITY_ID) === true;
  const paused = readValue(device, ROBOROCK_PAUSE_CAPABILITY_ID) === true;
  const docked = readValue(device, ROBOROCK_DOCK_CAPABILITY_ID) === true;
  const chargingState = readValue(
    device,
    ROBOROCK_CHARGING_STATE_CAPABILITY_ID
  );
  const battery = readBattery(device);

  if (paused) {
    return sceneState(ROBOROCK_SCENE.PAUSED, "Pause", true);
  }

  if (cleaning) {
    return sceneState(ROBOROCK_SCENE.CLEANING, "Rengjør", true);
  }

  if (!docked && chargingState === "discharging") {
    return sceneState(ROBOROCK_SCENE.RETURNING, "Hjem", true);
  }

  if (!docked) {
    return sceneState(ROBOROCK_SCENE.PAUSED, "Stoppet", true);
  }

  const stillCharging =
    chargingState === "charging" &&
    (battery === null || battery < ROBOROCK_FULL_BATTERY);

  if (stillCharging) {
    return sceneState(ROBOROCK_SCENE.CHARGING, "Lader", false);
  }

  return sceneState(ROBOROCK_SCENE.DOCKED, "I dock", false);
};

/** True while the robot is driving: cleaning or heading back to the dock. */
export const isRoborockRunning = (device) => {
  const { scene } = getRoborockVisualState(device);
  return (
    scene === ROBOROCK_SCENE.CLEANING || scene === ROBOROCK_SCENE.RETURNING
  );
};
