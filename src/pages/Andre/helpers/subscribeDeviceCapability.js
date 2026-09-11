/** key = `${deviceId}::${capability}` → Set of listeners */
const listenersByKey = new Map();
/** key → Homey capability instance */
const instancesByKey = new Map();

const keyFor = (deviceId, capability) => `${deviceId}::${capability}`;

const destroyHomeyInstances = (device, capability) => {
  const existing = device?.__capabilityInstances?.[capability];
  if (!Array.isArray(existing)) return;
  [...existing].forEach((instance) => {
    try {
      instance.destroy?.();
    } catch {
      // ignore
    }
  });
};

/**
 * Share one Homey capability instance across multiple React hooks
 * (RoomCard stays mounted under RoomDetail and would otherwise duplicate work).
 *
 * Always pass a real Homey Device (from getDevices), never a spread/plain copy.
 */
export const subscribeDeviceCapability = (device, capability, onValue) => {
  if (!device?.id || !capability) return () => {};
  if (!device.capabilities?.includes(capability)) return () => {};
  if (typeof device.makeCapabilityInstance !== "function") return () => {};

  const key = keyFor(device.id, capability);
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(key, listeners);
  }
  listeners.add(onValue);

  if (!instancesByKey.has(key)) {
    const attach = () =>
      device.makeCapabilityInstance(capability, (newValue) => {
        const current = listenersByKey.get(key);
        if (!current) return;
        current.forEach((listener) => {
          try {
            listener(newValue);
          } catch {
            // ignore listener errors
          }
        });
      });

    try {
      instancesByKey.set(key, attach());
    } catch {
      // HMR / leftover instances — destroy and retry once
      destroyHomeyInstances(device, capability);
      try {
        instancesByKey.set(key, attach());
      } catch {
        // Live updates unavailable for this capability until full reload
      }
    }
  }

  return () => {
    const current = listenersByKey.get(key);
    if (!current) return;
    current.delete(onValue);
    if (current.size > 0) return;

    listenersByKey.delete(key);
    const instance = instancesByKey.get(key);
    instancesByKey.delete(key);
    try {
      instance?.destroy?.();
    } catch {
      // ignore
    }
  };
};
