export const getPrecipitationMm = (period) => {
  const amount = period?.details?.precipitation_amount;
  return typeof amount === "number" && amount > 0 ? amount : 0;
};
