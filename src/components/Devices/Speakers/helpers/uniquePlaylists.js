export const playlistIdentity = (playlist) => {
  if (playlist?.uri) return String(playlist.uri);
  if (playlist?.id && playlist?.name) return `${playlist.id}:${playlist.name}`;
  if (playlist?.id) return String(playlist.id);
  if (playlist?.name) return String(playlist.name);
  return "";
};

export const uniquePlaylists = (playlists) => {
  const seen = new Set();
  return (Array.isArray(playlists) ? playlists : []).filter((playlist) => {
    const identity = playlistIdentity(playlist);
    if (!identity) return true;
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
};
