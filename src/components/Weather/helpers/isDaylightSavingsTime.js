export const isDaylightSavingsTime = () => {
  const today = new Date();
  const jan = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== today.getTimezoneOffset();
};
