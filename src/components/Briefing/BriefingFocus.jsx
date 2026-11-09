import React, { useEffect, useState } from "react";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { briefingReadPath } from "../../helpers/briefingKind";
import { briefingTitleName } from "./Briefing.constants";
import { briefingRuns } from "./helpers/briefingRuns";
import "./BriefingFocus.css";

const OFFLINE_TEXT = "Får ikke kontakt med HomeOS.";

export const BriefingFocus = ({ kind, title, close }) => {
  const [loaded, setLoaded] = useState({ kind, text: null });

  if (loaded.kind !== kind) {
    setLoaded({ kind, text: null });
  }

  const text = loaded.kind === kind ? loaded.text : null;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(briefingReadPath(kind), {
          signal: controller.signal,
        });
        const body = await response.json();
        if (!active) {
          return;
        }
        const next = body?.text;
        if (typeof next === "string" && next.trim() !== "") {
          setLoaded({ kind, text: next });
          return;
        }
        setLoaded({ kind, text: OFFLINE_TEXT });
      } catch (error) {
        if (!active || error?.name === "AbortError") {
          return;
        }
        setLoaded({ kind, text: OFFLINE_TEXT });
      }
    };

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [kind]);

  return (
    <FocusedElement
      title={title}
      titleTransitionName={briefingTitleName(kind)}
      titleTransitionShare="briefing-share-title"
      onCloseClick={close}
      className="briefing-focus"
    >
      {text === null ? (
        <p className="briefing-focus-status">Henter…</p>
      ) : (
        <p className="briefing-focus-text">
          {briefingRuns(text).map((run, index) =>
            run.bold ? (
              <strong key={index}>{run.text}</strong>
            ) : (
              <span key={index}>{run.text}</span>
            )
          )}
        </p>
      )}
    </FocusedElement>
  );
};
