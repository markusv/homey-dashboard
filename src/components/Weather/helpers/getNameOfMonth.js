export const getNameOfMonth = (date) => {
  const month = date.getMonth();
  if (month === 0) return "Jan";
  if (month === 1) return "Feb";
  if (month === 2) return "Mar";
  if (month === 3) return "Apr";
  if (month === 4) return "Mai";
  if (month === 5) return "Jun";
  if (month === 6) return "Jul";
  if (month === 7) return "Aug";
  if (month === 8) return "Sep";
  if (month === 9) return "Okt";
  if (month === 10) return "Nov";
  if (month === 11) return "Des";
};
