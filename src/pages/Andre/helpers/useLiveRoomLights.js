import { useCallback, useEffect, useState } from "react";
import { updateCapabilityOnDevice } from "../../../components/Devices/helpers/updateCapabolityOnDevice";
import {
  areLightsOn,
  getAverageDim,
  getRoomLights,
  lightsSupportCapability,
  lightsWithCapability,
} from "../helpers/getRoomLights";
import { getLightGroupColor } from "../helpers/lightColor";
import { setCapabilityOnDevices } from "../helpers/setCapabilityOnDevices";
import { useActionLock } from "../helpers/useActionLock";
import { useDebounce } from "../../../helpers/useDebounce";
import { cssHexToHomey } from "../helpers/lightColor";

const TRACKED_CAPS = [
  "onoff",
  "dim",
  "light_hue",
  "light_saturation",
  "light_mode",
];

export const useLiveRoomLights = (devices, room) => {
  const [lights, setLights] = useState(() => getRoomLights(devices, room));
  const [run, pending] = useActionLock();

  useEffect(() => {
    setLights(getRoomLights(devices, room));
  }, [devices, room]);

  useEffect(() => {
    if (!lights.length) return undefined;

    lights.forEach((light) => {
      TRACKED_CAPS.forEach((capability) => {
        if (!light.capabilities?.includes(capability)) return;
        try {
          light.makeCapabilityInstance(capability, (newValue) => {
            setLights((prev) =>
              prev.map((entry) =>
                entry.id === light.id
                  ? updateCapabilityOnDevice(entry, capability, newValue)
                  : entry
              )
            );
          });
        } catch {
          // Capability may already have an instance
        }
      });
    });
    return undefined;
    // Re-subscribe when the set of light IDs changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lights.map((light) => light.id).join("|")]);

  const on = areLightsOn(lights);
  const supportsDim = lightsSupportCapability(lights, "dim");
  const supportsColor = lightsSupportCapability(lights, "light_hue");
  const color = getLightGroupColor(lights);
  const dim = getAverageDim(lights);

  const toggleLights = useCallback(async () => {
    const targets = lightsWithCapability(lights, "onoff");
    if (!targets.length) return;
    const next = !on;
    setLights((prev) =>
      prev.map((light) =>
        light.capabilities?.includes("onoff")
          ? updateCapabilityOnDevice(light, "onoff", next)
          : light
      )
    );
    await run(() => setCapabilityOnDevices(targets, "onoff", next));
  }, [lights, on, run]);

  const setDim = useCallback(
    async (value) => {
      const targets = lightsWithCapability(lights, "dim");
      if (!targets.length) return;
      setLights((prev) =>
        prev.map((light) =>
          light.capabilities?.includes("dim")
            ? updateCapabilityOnDevice(light, "dim", value)
            : light
        )
      );
      await setCapabilityOnDevices(targets, "dim", value);
    },
    [lights]
  );

  const setColor = useCallback(
    async (hex) => {
      const homeyColor = cssHexToHomey(hex);
      if (!homeyColor) return;
      const hueTargets = lightsWithCapability(lights, "light_hue");
      const satTargets = lightsWithCapability(lights, "light_saturation");
      const modeTargets = lightsWithCapability(lights, "light_mode");

      setLights((prev) =>
        prev.map((light) => {
          let next = light;
          if (light.capabilities?.includes("light_hue")) {
            next = updateCapabilityOnDevice(
              next,
              "light_hue",
              homeyColor.light_hue
            );
          }
          if (light.capabilities?.includes("light_saturation")) {
            next = updateCapabilityOnDevice(
              next,
              "light_saturation",
              homeyColor.light_saturation
            );
          }
          if (light.capabilities?.includes("light_mode")) {
            next = updateCapabilityOnDevice(next, "light_mode", "color");
          }
          return next;
        })
      );

      await run(async () => {
        await setCapabilityOnDevices(modeTargets, "light_mode", "color");
        await setCapabilityOnDevices(
          hueTargets,
          "light_hue",
          homeyColor.light_hue
        );
        await setCapabilityOnDevices(
          satTargets,
          "light_saturation",
          homeyColor.light_saturation
        );
      });
    },
    [lights, run]
  );

  return {
    lights,
    on,
    dim,
    color,
    supportsDim,
    supportsColor,
    pending,
    toggleLights,
    setDim,
    setColor,
  };
};

export const useDebouncedDim = (dim, setDim) => {
  const [localDim, setLocalDim] = useState(dim);
  const [isDragging, setIsDragging] = useState(false);
  const debounced = useDebounce(localDim, 350);

  useEffect(() => {
    if (!isDragging) {
      setLocalDim(dim);
    }
  }, [dim, isDragging]);

  useEffect(() => {
    if (Math.abs(debounced - dim) < 0.005) return;
    setDim(debounced);
  }, [debounced, dim, setDim]);

  return [
    localDim,
    (value) => {
      setIsDragging(true);
      setLocalDim(value);
    },
    () => {
      setIsDragging(false);
    },
  ];
};
