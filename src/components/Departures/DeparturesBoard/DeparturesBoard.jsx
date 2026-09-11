import React, { useEffect, useState } from "react";
import { useFetchDepartures } from "../hooks/useFetchDepartures";
import { DepartureRow } from "./DepartureRow/DepartureRow";
import { SituationBanner } from "./SituationBanner/SituationBanner";
import "./DeparturesBoard.css";

const StopIcon = ({ mode }) => {
  if (mode === "rail") {
    return (
      <svg
        className="departures-stop-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M12 2c-4.4 0-8 1.8-8 4v9c0 2.2 1.8 4 4 4l-1.5 1.5v.5h11v-.5L16 19c2.2 0 4-1.8 4-4V6c0-2.2-3.6-4-8-4M7.5 16c-.8 0-1.5-.7-1.5-1.5S6.7 13 7.5 13s1.5.7 1.5 1.5S8.3 16 7.5 16m9 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5M18 11H6V6h12z"
        />
      </svg>
    );
  }
  return (
    <svg
      className="departures-stop-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2C8 2 4 2.5 4 6v9.5A3.5 3.5 0 0 0 7.5 19l-1.5 1.5v.5h12v-.5L16.5 19A3.5 3.5 0 0 0 20 15.5V6c0-3.5-4-4-8-4m-4.5 15A1.5 1.5 0 1 1 9 15.5 1.5 1.5 0 0 1 7.5 17m9 0A1.5 1.5 0 1 1 18 15.5 1.5 1.5 0 0 1 16.5 17M18 12H6V6.5c0-.3 2-1.5 6-1.5s6 1.2 6 1.5z"
      />
    </svg>
  );
};

const getDepartureKey = (stopId, departure) =>
  `${stopId}-${departure.line}-${departure.expectedTime}-${departure.destination}`;

export const DeparturesBoard = () => {
  const [board] = useFetchDepartures();
  const [now, setNow] = useState(() => new Date());
  const [openSituation, setOpenSituation] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!openSituation) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenSituation(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSituation]);

  const stops = board?.stops || [];
  const hasRealtime = stops.some((stop) =>
    stop.departures?.some((departure) => departure.realtime)
  );

  const toggleSituation = (key, message) => {
    setOpenSituation((current) =>
      current?.key === key ? null : { key, message }
    );
  };

  return (
    <section className="departures-board" aria-label="Neste avgang">
      <header className="departures-board-header">
        <h2 className="departures-board-title">Neste avgang</h2>
        <div className="departures-board-meta">
          {hasRealtime ? (
            <span className="departures-live">
              <span className="departures-live-dot" aria-hidden="true" />
              Sanntid
            </span>
          ) : null}
        </div>
      </header>

      {!board ? (
        <div className="departures-board-empty">Laster avganger…</div>
      ) : (
        <div className="departures-stops">
          {stops.map((stop) => (
            <div key={stop.id} className="departures-stop">
              <div className="departures-stop-title">
                <StopIcon mode={stop.mode} />
                {stop.title}
              </div>
              {stop.departures?.length ? (
                stop.departures.map((departure) => {
                  const key = getDepartureKey(stop.id, departure);
                  const message = (departure.situations || []).join(" · ");
                  return (
                    <DepartureRow
                      key={key}
                      departure={departure}
                      now={now}
                      isSituationOpen={openSituation?.key === key}
                      onToggleSituation={() => toggleSituation(key, message)}
                    />
                  );
                })
              ) : (
                <div className="departures-stop-empty">Ingen avganger</div>
              )}
            </div>
          ))}
        </div>
      )}

      <SituationBanner
        message={openSituation?.message}
        onDismiss={() => setOpenSituation(null)}
      />
    </section>
  );
};
