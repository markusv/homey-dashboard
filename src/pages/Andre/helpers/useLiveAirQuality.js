import { useEffect, useMemo, useState } from "react";
import { useGetDevice } from "../../../components/Devices/helpers/useGetDevice";
import { updateCapabilityOnDevice } from "../../../components/Devices/helpers/updateCapabolityOnDevice";
import { subscribeDeviceCapability } from "./subscribeDeviceCapability";
import { getRoomAirQualityDeviceId } from "./getRoomAirQualityDevice";
import {
  getAirthingsOverallStatus,
  getCardMetrics,
  getDetailMetrics,
  getMetricReading,
  getMetricsForDevice,
} from "./airQualityMetrics";

export const useLiveAirQuality = (devices, room) => {
  const deviceId = useMemo(
    () => getRoomAirQualityDeviceId(devices, room),
    [devices, room]
  );
  const [device, setDevice] = useGetDevice(deviceId);
  const [liveValues, setLiveValues] = useState({});

  const metrics = useMemo(() => getMetricsForDevice(device), [device]);
  const metricsKey = metrics.map((metric) => metric.capability).join("|");

  useEffect(() => {
    if (!device || !metricsKey) {
      setLiveValues({});
      return undefined;
    }

    const tracked = getMetricsForDevice(device);

    setLiveValues(
      tracked.reduce((acc, metric) => {
        const value = device.capabilitiesObj?.[metric.capability]?.value;
        if (typeof value === "number") {
          acc[metric.capability] = value;
        }
        return acc;
      }, {})
    );

    const unsubs = tracked.map((metric) =>
      subscribeDeviceCapability(device, metric.capability, (value) => {
        setLiveValues((prev) => ({ ...prev, [metric.capability]: value }));
        setDevice((current) =>
          current
            ? updateCapabilityOnDevice(current, metric.capability, value)
            : current
        );
      })
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [device?.id, metricsKey, setDevice]);

  const cardReadings = useMemo(
    () =>
      getCardMetrics(device)
        .map((metric) => getMetricReading(metric, device, liveValues))
        .filter(Boolean),
    [device, liveValues]
  );

  const detailReadings = useMemo(
    () =>
      getDetailMetrics(device)
        .map((metric) => getMetricReading(metric, device, liveValues))
        .filter(Boolean),
    [device, liveValues]
  );

  const overallStatus = useMemo(
    () => getAirthingsOverallStatus(detailReadings),
    [detailReadings]
  );

  return {
    deviceId,
    hasAirQuality: metrics.length > 0,
    cardReadings,
    detailReadings,
    overallStatus,
  };
};
