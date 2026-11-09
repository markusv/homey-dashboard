import React, { useState, startTransition, ViewTransition } from "react";
import { SlButton } from "@shoelace-style/shoelace/dist/react";
import { STUE_BRIEFINGS, briefingTitleName } from "./Briefing.constants";
import { BriefingFocus } from "./BriefingFocus";
import "./BriefingButtons.css";

export const BriefingButtons = ({ onSetFocus }) => {
  const [openKind, setOpenKind] = useState(null);

  const openBriefing = (briefing) => {
    // After the click, so the button's pressed style can clear the same way as the moods.
    requestAnimationFrame(() => {
      startTransition(() => {
        setOpenKind(briefing.kind);
        onSetFocus(
          {
            id: `briefing-${briefing.kind}`,
            render: (close) => (
              <BriefingFocus
                key={briefing.kind}
                kind={briefing.kind}
                title={briefing.label}
                close={() => {
                  startTransition(() => {
                    setOpenKind(null);
                    close();
                  });
                }}
              />
            ),
          },
          false
        );
      });
    });
  };

  return (
    <div className="briefing-buttons">
      {STUE_BRIEFINGS.map((briefing) => {
        const label = (
          <span className="briefing-button-label">{briefing.label}</span>
        );
        return (
          <div
            key={briefing.kind}
            className="mood"
            onClick={() => {
              openBriefing(briefing);
            }}
          >
            <SlButton size="large" className="mood-button">
              <sl-icon name={briefing.icon} class="mood-icon" />
              {openKind === briefing.kind ? (
                label
              ) : (
                <ViewTransition
                  name={briefingTitleName(briefing.kind)}
                  share="briefing-share-title"
                  enter="none"
                  default="none"
                >
                  {label}
                </ViewTransition>
              )}
            </SlButton>
          </div>
        );
      })}
    </div>
  );
};
