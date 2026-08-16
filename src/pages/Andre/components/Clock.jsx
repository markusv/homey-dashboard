import React, { useEffect, useState } from "react";

const formatTime = (date) =>
  date.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (date) =>
  date.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const Clock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="andre-clock">
      <div className="andre-clock-time">{formatTime(now)}</div>
      <div className="andre-clock-date">{formatDate(now)}</div>
    </header>
  );
};
