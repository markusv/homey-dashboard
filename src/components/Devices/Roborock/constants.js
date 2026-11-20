export const ROBOROCK_ONOFF_CAPABILITY_ID = "onoff";
export const ROBOROCK_STATE_CAPABILITY_ID = "vacuumcleaner_state";
export const ROBOROCK_RETURN_TO_DOCK_CAPABILITY_ID = "cancel_and_dock";
export const ROBOROCK_CLEANING_CAPABILITY_ID = "is_cleaning";
export const ROBOROCK_PAUSE_CAPABILITY_ID = "pause_clean";
export const ROBOROCK_DOCK_CAPABILITY_ID = "dock";
export const ROBOROCK_CHARGING_STATE_CAPABILITY_ID = "battery_charging_state";
export const ROBOROCK_BATTERY_CAPABILITY_ID = "measure_battery";

export const ROBOROCK_LIVE_CAPABILITY_IDS = [
  ROBOROCK_CLEANING_CAPABILITY_ID,
  ROBOROCK_PAUSE_CAPABILITY_ID,
  ROBOROCK_DOCK_CAPABILITY_ID,
  ROBOROCK_CHARGING_STATE_CAPABILITY_ID,
  ROBOROCK_BATTERY_CAPABILITY_ID,
];

export const ROBOROCK_SCENE = {
  CLEANING: "cleaning",
  RETURNING: "returning",
  PAUSED: "paused",
  CHARGING: "charging",
  DOCKED: "docked",
};

/** Homey keeps battery_charging_state at "charging" after the pack is full. */
export const ROBOROCK_FULL_BATTERY = 100;
