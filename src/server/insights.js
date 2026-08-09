/**
 * Bucket Homey Insights samples (typically 5‑minute steps) into N hourly points.
 * Uses the mean of samples that fall inside each hour bucket.
 */
export const bucketHourlyPoints = (values, hours = 24) => {
  if (!Array.isArray(values) || values.length === 0) return [];

  const sorted = values
    .filter((entry) => entry && entry.t != null && typeof entry.v === "number")
    .map((entry) => ({ t: new Date(entry.t).getTime(), v: entry.v }))
    .filter((entry) => !Number.isNaN(entry.t))
    .sort((a, b) => a.t - b.t);

  if (sorted.length === 0) return [];

  const endMs = sorted[sorted.length - 1].t;
  const hourMs = 60 * 60 * 1000;
  const endHour = Math.ceil((endMs + 1) / hourMs) * hourMs;
  const startHour = endHour - hours * hourMs;

  const buckets = Array.from({ length: hours }, () => ({ sum: 0, count: 0 }));

  for (const { t, v } of sorted) {
    if (t < startHour || t >= endHour) continue;
    const index = Math.floor((t - startHour) / hourMs);
    if (index < 0 || index >= hours) continue;
    buckets[index].sum += v;
    buckets[index].count += 1;
  }

  const points = [];
  let last = null;
  for (const bucket of buckets) {
    if (bucket.count > 0) {
      last = Math.round((bucket.sum / bucket.count) * 10) / 10;
      points.push(last);
    } else if (last != null) {
      points.push(last);
    }
  }

  if (points.length < hours && points.length > 0) {
    const first = points[0];
    while (points.length < hours) {
      points.unshift(first);
    }
  }

  return points.slice(-hours);
};
