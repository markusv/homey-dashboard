import { describe, expect, it } from "vitest";
import { ROBOROCK_SCENE } from "../constants";
import {
  getRoborockVisualState,
  isRoborockRunning,
} from "./getRoborockVisualState";

const deviceWith = (values) => ({
  capabilitiesObj: Object.fromEntries(
    Object.entries(values).map(([id, value]) => [id, { value }])
  ),
});

describe("getRoborockVisualState", () => {
  it("stays still before the device has loaded", () => {
    expect(getRoborockVisualState(undefined)).toEqual({
      scene: ROBOROCK_SCENE.DOCKED,
      status: "",
      showDockButton: false,
    });
  });

  it("drives while cleaning and offers the dock button", () => {
    expect(
      getRoborockVisualState(
        deviceWith({
          is_cleaning: true,
          pause_clean: false,
          dock: false,
          battery_charging_state: "discharging",
          measure_battery: 80,
        })
      )
    ).toEqual({
      scene: ROBOROCK_SCENE.CLEANING,
      status: "Rengjør",
      showDockButton: true,
    });
  });

  it("holds still on the grid when paused", () => {
    expect(
      getRoborockVisualState(
        deviceWith({
          is_cleaning: true,
          pause_clean: true,
          dock: false,
          battery_charging_state: "discharging",
          measure_battery: 70,
        })
      ).scene
    ).toBe(ROBOROCK_SCENE.PAUSED);
  });

  it("shows a return trip when it is out and discharging", () => {
    expect(
      getRoborockVisualState(
        deviceWith({
          is_cleaning: false,
          dock: false,
          battery_charging_state: "discharging",
          measure_battery: 64,
        })
      )
    ).toMatchObject({
      scene: ROBOROCK_SCENE.RETURNING,
      showDockButton: true,
    });
  });

  it("pulses rings only while the battery is still charging", () => {
    expect(
      getRoborockVisualState(
        deviceWith({
          is_cleaning: false,
          dock: true,
          battery_charging_state: "charging",
          measure_battery: 77,
        })
      )
    ).toEqual({
      scene: ROBOROCK_SCENE.CHARGING,
      status: "Lader",
      showDockButton: false,
    });
  });

  it("counts cleaning and the return trip as running", () => {
    expect(
      isRoborockRunning(
        deviceWith({
          is_cleaning: true,
          pause_clean: false,
          dock: false,
        })
      )
    ).toBe(true);
    expect(
      isRoborockRunning(
        deviceWith({
          is_cleaning: false,
          dock: false,
          battery_charging_state: "discharging",
        })
      )
    ).toBe(true);
    expect(
      isRoborockRunning(
        deviceWith({
          is_cleaning: true,
          pause_clean: true,
          dock: false,
        })
      )
    ).toBe(false);
    expect(isRoborockRunning(undefined)).toBe(false);
  });

  it("drops the rings when Homey still says charging at 100%", () => {
    expect(
      getRoborockVisualState(
        deviceWith({
          is_cleaning: false,
          dock: true,
          battery_charging_state: "charging",
          measure_battery: 100,
        })
      )
    ).toEqual({
      scene: ROBOROCK_SCENE.DOCKED,
      status: "I dock",
      showDockButton: false,
    });
  });
});
