import { useCallback, useEffect, useState } from "react";
import { updateCapabilityOnDevice } from "../../../components/Devices/helpers/updateCapabolityOnDevice";
import { getHomey } from "../../../helpers/getHomey";
import {
  BLINDS_DOWN,
  BLINDS_UP,
  WINDOWCOVERINGS_SET,
  areBlindsDown,
  areBlindsUp,
  blindsWithSet,
  getRoomBlinds,
} from "./getRoomBlinds";
import { setCapabilityOnDevices } from "./setCapabilityOnDevices";
import { subscribeBlindPosition } from "./subscribeBlindPosition";
import { useActionLock } from "./useActionLock";

const readBlindPositions = async (deviceIds) => {
  const homeyApi = await getHomey();
  const entries = await Promise.all(
    deviceIds.map(async (id) => {
      try {
        const device = await homeyApi.devices.getDevice({ id });
        return [id, device?.capabilitiesObj?.[WINDOWCOVERINGS_SET]?.value];
      } catch {
        return [id, null];
      }
    })
  );
  return new Map(entries);
};

const applyPositions = (blinds, positionsById) =>
  blinds.map((blind) => {
    const value = positionsById.get(blind.id);
    if (typeof value !== "number") return blind;
    return updateCapabilityOnDevice(blind, WINDOWCOVERINGS_SET, value);
  });

export const useLiveRoomBlinds = (devices, room) => {
  const [blinds, setBlinds] = useState(() => getRoomBlinds(devices, room));
  const [run, pending] = useActionLock();

  useEffect(() => {
    setBlinds(getRoomBlinds(devices, room));
  }, [devices, room]);

  const blindIdsKey = blinds.map((blind) => blind.id).join("|");

  useEffect(() => {
    if (!devices || !blindIdsKey) return undefined;

    const deviceList = Array.isArray(devices)
      ? devices
      : Object.values(devices);
    const devicesById = new Map(
      deviceList.map((device) => [device.id, device])
    );

    const unsubscribers = blindIdsKey.split("|").map((blindId) => {
      const device = devicesById.get(blindId);
      if (!device) return () => {};
      return subscribeBlindPosition(device, (newValue) => {
        setBlinds((prev) =>
          prev.map((entry) =>
            entry.id === blindId
              ? updateCapabilityOnDevice(entry, WINDOWCOVERINGS_SET, newValue)
              : entry
          )
        );
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [blindIdsKey, devices]);

  const setPosition = useCallback(
    (value) => {
      const targets = blindsWithSet(blinds);
      if (!targets.length) return Promise.resolve();
      const deviceIds = targets.map((blind) => blind.id);

      return run(async () => {
        await setCapabilityOnDevices(targets, WINDOWCOVERINGS_SET, value);
      }).then(async () => {
        // Refresh from Homey so UI follows real positions (not last click).
        const refresh = async () => {
          const positions = await readBlindPositions(deviceIds);
          setBlinds((prev) => applyPositions(prev, positions));
        };
        await refresh();
        window.setTimeout(refresh, 800);
        window.setTimeout(refresh, 2000);
      });
    },
    [blinds, run]
  );

  const raiseBlinds = useCallback(() => setPosition(BLINDS_UP), [setPosition]);
  const lowerBlinds = useCallback(
    () => setPosition(BLINDS_DOWN),
    [setPosition]
  );

  return {
    blinds,
    pending,
    isUp: areBlindsUp(blinds),
    isDown: areBlindsDown(blinds),
    raiseBlinds,
    lowerBlinds,
  };
};
