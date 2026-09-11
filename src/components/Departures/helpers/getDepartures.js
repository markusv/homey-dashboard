export const getDepartures = async () => {
  const response = await fetch("/api/read/departures");
  if (!response.ok) {
    return null;
  }
  return response.json();
};
