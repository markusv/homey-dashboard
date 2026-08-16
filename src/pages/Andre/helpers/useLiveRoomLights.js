import { useCallback, useEffect, useRef, useState } from "react";
import { updateCapabilityOnDevice } from "../../../components/Devices/helpers/updateCapabolityOnDevice";
import {
  areLightsOn,
  getAverageDim,
  getPrimaryLight,
  getRoomLights,
  lightsSupportCapability,
  lightsWithCapability,
} from "../helpers/getRoomLights";
import { getLightGroupColor } from "../helpers/lightColor";
import { setCapabilityOnDevices } from "../helpers/setCapabilityOnDevices";
import { subscribeDeviceCapability } from "../helpers/subscribeDeviceCapability";
import { useActionLock } from "../helpers/useActionLock";
import { cssHexToHomey } from "../helpers/lightColor";

const TRACKED_CAPS = [
  "onoff",
  "dim",
  "light_hue",
  "light_saturation",
  "light_mode",
];

export const useLiveRoomLights = (devices, room, zones) => {
  const [lights, setLights] = useState(() =>
    getRoomLights(devices, room, zones)
  );
  const [run, pending] = useActionLock();

  useEffect(() => {
    setLights(getRoomLights(devices, room, zones));
  }, [devices, room, zones]);

  const lightIdsKey = lights.map((light) => light.id).join("|");

  useEffect(() => {
    if (!devices || !lightIdsKey) return undefined;

    const deviceList = Array.isArray(devices)
      ? devices
      : Object.values(devices);
    const devicesById = new Map(
      deviceList.map((device) => [device.id, device])
    );
    const lightIds = lightIdsKey.split("|").filter(Boolean);

    const unsubscribers = lightIds.flatMap((lightId) => {
      // Must use Homey Device instances — lights state may hold plain copies.
      const device = devicesById.get(lightId);
      if (!device) return [];

      const caps = TRACKED_CAPS.filter((capability) =>
        device.capabilities?.includes(capability)
      );

      return caps.map((capability) =>
        subscribeDeviceCapability(device, capability, (newValue) => {
          setLights((prev) =>
            prev.map((entry) =>
              entry.id === lightId
                ? updateCapabilityOnDevice(entry, capability, newValue)
                : entry
            )
          );
        })
      );
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [lightIdsKey, devices]);

  const primary = getPrimaryLight(lights, room);
  const statusLights = primary ? [primary] : lights;
  const on = areLightsOn(lights, room);
  const supportsDim = lightsSupportCapability(statusLights, "dim");
  const supportsColor = lightsSupportCapability(statusLights, "light_hue");
  const color = getLightGroupColor(statusLights);
  const dim = getAverageDim(lights, room);

  const toggleLights = useCallback(async () => {
    const next = !on;
    const commandTargets = lightsWithCapability(lights, "onoff");
    if (!commandTargets.length) return;

    const commandIds = new Set(commandTargets.map((light) => light.id));

    setLights((prev) =>
      prev.map((light) => {
        if (!light.capabilities?.includes("onoff")) return light;
        if (!commandIds.has(light.id)) return light;
        return updateCapabilityOnDevice(light, "onoff", next);
      })
    );

    await run(() => setCapabilityOnDevices(commandTargets, "onoff", next));
  }, [lights, on, run]);

  const setDim = useCallback(
    async (value) => {
      const targets = lightsWithCapability(lights, "dim");
      if (!targets.length) return;
      const commandIds = new Set(targets.map((light) => light.id));
      setLights((prev) =>
        prev.map((light) =>
          light.capabilities?.includes("dim") && commandIds.has(light.id)
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

      const primaryLight = getPrimaryLight(lights, room);
      const hueTargets = primaryLight?.capabilities?.includes("light_hue")
        ? [primaryLight]
        : lightsWithCapability(lights, "light_hue");
      const satTargets = primaryLight?.capabilities?.includes(
        "light_saturation"
      )
        ? [primaryLight]
        : lightsWithCapability(lights, "light_saturation");
      const modeTargets = primaryLight?.capabilities?.includes("light_mode")
        ? [primaryLight]
        : lightsWithCapability(lights, "light_mode");

      const commandIds = new Set(
        [...hueTargets, ...satTargets, ...modeTargets].map((light) => light.id)
      );

      setLights((prev) =>
        prev.map((light) => {
          if (!commandIds.has(light.id)) return light;
          let nextLight = light;
          if (light.capabilities?.includes("light_hue")) {
            nextLight = updateCapabilityOnDevice(
              nextLight,
              "light_hue",
              homeyColor.light_hue
            );
          }
          if (light.capabilities?.includes("light_saturation")) {
            nextLight = updateCapabilityOnDevice(
              nextLight,
              "light_saturation",
              homeyColor.light_saturation
            );
          }
          if (light.capabilities?.includes("light_mode")) {
            nextLight = updateCapabilityOnDevice(
              nextLight,
              "light_mode",
              "color"
            );
          }
          return nextLight;
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
    [lights, room, run]
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
  const localDimRef = useRef(dim);
  const draggingRef = useRef(false);

  useEffect(() => {
    // Follow Homey while the user is not dragging — never write back from this.
    if (draggingRef.current) return;
    localDimRef.current = dim;
    setLocalDim(dim);
  }, [dim]);

  return [
    localDim,
    (value) => {
      draggingRef.current = true;
      localDimRef.current = value;
      setLocalDim(value);
    },
    () => {
      draggingRef.current = false;
      // Only push to Homey when the user releases the slider.
      setDim(localDimRef.current);
    },
  ];
};
