export const getDoorbellSnapshotImage = (device) => {
  const images = Array.isArray(device?.images) ? device.images : [];
  const snapshot =
    images.find((image) => image?.type === "camera" && image?.id === "main") ??
    images.find((image) => image?.type === "camera");
  const id = snapshot?.imageObj?.id;
  if (!id) return null;

  return {
    id,
    url: snapshot.imageObj.url || `/api/image/${id}`,
  };
};

export const isJpeg = (bytes) => {
  if (!bytes || bytes.length < 3) return false;
  return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
};
