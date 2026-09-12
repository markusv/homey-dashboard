export const getPrecipMotionScale = ({
  animate,
  intensity = 0,
  dtSeconds = 0,
}) => {
  if (!animate || dtSeconds <= 0) {
    return 0;
  }
  const intensityScale = 0.7 + intensity * 0.65;
  return intensityScale * dtSeconds;
};
