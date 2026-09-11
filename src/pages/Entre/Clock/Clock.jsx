import React, { useEffect, useState } from "react";
import "./Clock.css";

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

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return (
    <header className="entre-clock">
      <div className="entre-clock-time" aria-label={formatTime(now)}>
        <span className="entre-clock-hours">{hours}</span>
        <span className="clock-colon" aria-hidden="true">
          :
        </span>
        <span className="entre-clock-minutes">{minutes}</span>
      </div>
      <div className="entre-clock-date">{formatDate(now)}</div>
    </header>
  );
};
