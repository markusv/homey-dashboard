import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetDevice } from "../../../../../components/Devices/helpers/useGetDevice";
import { updateCapabilityOnDevice } from "../../../../../components/Devices/helpers/updateCapabolityOnDevice";
import { getHomey } from "../../../../../helpers/getHomey";
import { subscribeDeviceCapability } from "../../../helpers/subscribeDeviceCapability";
import { useActionLock } from "../../../hooks/useActionLock";

const TRACKED_CAPS = [
  "onoff",
  "thermostat_mode",
  "target_temperature",
  "measure_temperature",
  "fan_mode.speed",
  "fan_mode.powerful",
];

const MODE_LABELS = {
  heating: "Varme",
  cooling: "Kjøling",
  auto: "Auto",
  fanOnly: "Vifte",
  dry: "Tørr",
};

export const useLiveHeatPump = (deviceId) => {
  const [device, setDevice] = useGetDevice(deviceId);
  const [run, pending] = useActionLock();
  const deviceRef = useRef(device);
  deviceRef.current = device;

  const capsKey = useMemo(() => {
    if (!device?.capabilities?.length) return "";
    return TRACKED_CAPS.filter((cap) => device.capabilities.includes(cap)).join(
      "|"
    );
  }, [device]);

  useEffect(() => {
    if (!device || !capsKey) return undefined;

    const tracked = TRACKED_CAPS.filter((cap) =>
      device.capabilities.includes(cap)
    );

    const unsubs = tracked.map((capability) =>
      subscribeDeviceCapability(device, capability, (value) => {
        setDevice((current) =>
          current
            ? updateCapabilityOnDevice(current, capability, value)
            : current
        );
      })
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [device?.id, capsKey, setDevice]);

  const setCapability = useCallback(
    async (capabilityId, value) => {
      const current = deviceRef.current;
      if (!current?.id) return;

      setDevice(updateCapabilityOnDevice(current, capabilityId, value));
      const homeyApi = await getHomey();
      await homeyApi.devices.setCapabilityValue({
        deviceId: current.id,
        capabilityId,
        value,
      });
    },
    [setDevice]
  );

  const on = device?.capabilitiesObj?.onoff?.value === true;
  const mode = device?.capabilitiesObj?.thermostat_mode?.value ?? null;
  const target = device?.capabilitiesObj?.target_temperature?.value;
  const indoor = device?.capabilitiesObj?.measure_temperature?.value;
  const fanSpeed = device?.capabilitiesObj?.["fan_mode.speed"]?.value ?? null;
  const powerful =
    device?.capabilitiesObj?.["fan_mode.powerful"]?.value === "on";

  const targetMeta = device?.capabilitiesObj?.target_temperature;
  const targetMin = typeof targetMeta?.min === "number" ? targetMeta.min : 18;
  const targetMax = typeof targetMeta?.max === "number" ? targetMeta.max : 32;
  const targetStep =
    typeof targetMeta?.step === "number" ? targetMeta.step : 0.5;

  const fanSpeedOptions = device?.capabilitiesObj?.[
    "fan_mode.speed"
  ]?.values?.map((v) => v.id) ?? ["1", "2", "3", "4", "5"];

  const availableModes = (
    device?.capabilitiesObj?.thermostat_mode?.values?.map((v) => v.id) ?? []
  ).filter((id) => id === "heating" || id === "cooling");

  const togglePower = useCallback(
    () => run(() => setCapability("onoff", !on)),
    [run, setCapability, on]
  );

  const setMode = useCallback(
    (nextMode) => run(() => setCapability("thermostat_mode", nextMode)),
    [run, setCapability]
  );

  const setTargetTemperature = useCallback(
    (value) => run(() => setCapability("target_temperature", value)),
    [run, setCapability]
  );

  const setFanSpeed = useCallback(
    (speed) => run(() => setCapability("fan_mode.speed", String(speed))),
    [run, setCapability]
  );

  const togglePowerful = useCallback(
    () =>
      run(() => setCapability("fan_mode.powerful", powerful ? "off" : "on")),
    [run, setCapability, powerful]
  );

  return {
    available: Boolean(device),
    on,
    mode,
    modeLabel: MODE_LABELS[mode] || mode,
    target: typeof target === "number" ? target : null,
    indoor: typeof indoor === "number" ? indoor : null,
    fanSpeed,
    fanSpeedOptions,
    powerful,
    availableModes,
    targetMin,
    targetMax,
    targetStep,
    pending,
    togglePower,
    setMode,
    setTargetTemperature,
    setFanSpeed,
    togglePowerful,
  };
};

/** Local slider value; push to Homey on release (same pattern as dim). */
export const useDebouncedTarget = (target, setTarget) => {
  const [local, setLocal] = useState(target);
  const localRef = useRef(target);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (draggingRef.current) return;
    localRef.current = target;
    setLocal(target);
  }, [target]);

  return [
    local,
    (value) => {
      draggingRef.current = true;
      localRef.current = value;
      setLocal(value);
    },
    () => {
      draggingRef.current = false;
      if (typeof localRef.current === "number") {
        setTarget(localRef.current);
      }
    },
  ];
};
