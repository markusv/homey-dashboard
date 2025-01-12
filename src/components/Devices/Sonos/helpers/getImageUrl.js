export const getImageUrl = (device) => {
  return device?.images?.[0].imageObj?.url;
};
