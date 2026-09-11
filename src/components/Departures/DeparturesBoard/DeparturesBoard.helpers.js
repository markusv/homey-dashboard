export const formatClock = (isoTime) =>
  new Date(isoTime).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDepartureCountdown = (isoTime, now = new Date()) => {
  const expected = new Date(isoTime);
  const minutes = Math.round((expected.getTime() - now.getTime()) / 60000);
  return {
    minutesLabel: minutes <= 0 ? "Nå" : String(minutes),
    unitLabel: minutes <= 0 ? "" : "min",
    clockLabel: formatClock(isoTime),
  };
};

export const getLineBadgeClassName = (line) => {
  const normalized = String(line || "")
    .trim()
    .toLowerCase();
  if (normalized === "l1") return "departures-line departures-line--l1";
  if (normalized === "4") return "departures-line departures-line--metro-4";
  if (normalized === "5") return "departures-line departures-line--metro-5";
  return "departures-line";
};
