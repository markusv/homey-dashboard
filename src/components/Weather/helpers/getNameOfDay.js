import { isToday } from "./isToday";
import { isTomorrow } from "./isTomorrow";

export const getNameOfDay = (date) => {
  const dayOfWeek = date.getDay();
  if (isToday(date)) return "I dag";
  if (isTomorrow(date)) return "I morgen";
  if (dayOfWeek === 0) return "Søndag";
  if (dayOfWeek === 1) return "Mandag";
  if (dayOfWeek === 2) return "Tirsdag";
  if (dayOfWeek === 3) return "Onsdag";
  if (dayOfWeek === 4) return "Torsdag";
  if (dayOfWeek === 5) return "Fredag";
  if (dayOfWeek === 6) return "Lørdag";
};
