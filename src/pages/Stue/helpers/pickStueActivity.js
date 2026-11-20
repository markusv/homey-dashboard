export const STUE_ACTIVITY = {
  ROBOROCK: "roborock",
  KITCHEN_SPEAKER: "kitchen-speaker",
};

/**
 * Which activity owns the Stue focus panel.
 * The one that became active most recently wins. If both were already
 * active when the dashboard loaded, the kitchen speaker wins.
 */
export const pickStueActivity = ({
  robotRunning,
  speakerPlaying,
  startedAt,
}) => {
  const active = [];
  if (robotRunning) {
    active.push({
      id: STUE_ACTIVITY.ROBOROCK,
      at: startedAt?.roborock ?? 0,
    });
  }
  if (speakerPlaying) {
    active.push({
      id: STUE_ACTIVITY.KITCHEN_SPEAKER,
      at: startedAt?.kitchen ?? 0,
    });
  }
  if (active.length === 0) return null;

  active.sort((a, b) => {
    if (b.at !== a.at) return b.at - a.at;
    if (a.id === STUE_ACTIVITY.KITCHEN_SPEAKER) return -1;
    if (b.id === STUE_ACTIVITY.KITCHEN_SPEAKER) return 1;
    return 0;
  });
  return active[0].id;
};
