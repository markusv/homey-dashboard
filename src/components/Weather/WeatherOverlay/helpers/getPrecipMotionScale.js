export const getPrecipMotionScale = ({ animate, dtSeconds = 0 }) => {
  if (!animate || dtSeconds <= 0) {
    return 0;
  }
  return dtSeconds;
};
