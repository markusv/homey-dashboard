import React, { useEffect, useState } from "react";
import { FocusedElement } from "../Focus/FocusedElement/FocusedElement";
import { briefingReadPath } from "../../helpers/briefingKind";
import { briefingTitleName } from "./Briefing.constants";
import { briefingBlocks, twemojiSrc } from "./helpers/briefingBlocks";
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
        <div className="briefing-focus-text">
          {briefingBlocks(text).map((paragraph, index) => (
            <p key={index}>
              {paragraph.map((part, partIndex) => {
                const Tag = part.bold ? "strong" : "span";
                return (
                  <Tag key={partIndex}>
                    {part.emoji ? (
                      <img
                        className="briefing-emoji"
                        alt=""
                        draggable={false}
                        src={twemojiSrc(part.text)}
                      />
                    ) : (
                      part.text
                    )}
                  </Tag>
                );
              })}
            </p>
          ))}
        </div>
      )}
    </FocusedElement>
  );
};
