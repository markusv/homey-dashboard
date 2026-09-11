/**
 * Collect a zone id plus optional descendant zone ids (Homey zone tree).
 */
export const getRoomZoneIds = (room, zones) => {
  const zoneIds = new Set();
  if (!room?.homeyZoneId) return zoneIds;

  zoneIds.add(room.homeyZoneId);

  if (!room.includeChildZoneLights || !zones) return zoneIds;

  const list = Array.isArray(zones) ? zones : Object.values(zones);
  const childrenByParent = new Map();
  list.forEach((zone) => {
    if (!zone?.parent) return;
    const siblings = childrenByParent.get(zone.parent) || [];
    siblings.push(zone.id);
    childrenByParent.set(zone.parent, siblings);
  });

  const stack = [room.homeyZoneId];
  while (stack.length) {
    const parentId = stack.pop();
    const children = childrenByParent.get(parentId) || [];
    children.forEach((childId) => {
      if (zoneIds.has(childId)) return;
      zoneIds.add(childId);
      stack.push(childId);
    });
  }

  return zoneIds;
};
