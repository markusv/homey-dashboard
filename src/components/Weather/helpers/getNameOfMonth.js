export const getNameOfMonth = (date) => {
  const month = date.getMonth();
  if (month === 0) return "Januar";
  if (month === 1) return "Februar";
  if (month === 2) return "Mars";
  if (month === 3) return "April";
  if (month === 4) return "Mai";
  if (month === 5) return "Juli";
  if (month === 6) return "Juli";
  if (month === 7) return "August";
  if (month === 8) return "September";
  if (month === 9) return "Oktober";
  if (month === 10) return "November";
  if (month === 11) return "Desember";
};
